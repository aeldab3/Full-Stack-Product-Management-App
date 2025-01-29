import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IProduct } from '../../models/iproduct';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiProductsService } from '../../services/api-products.service';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-products',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnChanges, OnInit {
  products: IProduct[] = [] as IProduct[];
  filteredProducts: IProduct[];
  totalOrderPrice: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 18;
  cartCount: number = 0;

  @Input() receivedCatId: string = '0';
  @Input() searchTerm: string = '';
  @Output() onTotalPriceChanged: EventEmitter<number>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _apiProductsService: ApiProductsService,
    private cartService: CartService
  ) {
    this.filteredProducts = this.products;
    this.onTotalPriceChanged = new EventEmitter<number>();
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.currentPage = params['page'] ? +params['page'] : 1; // Read the page from the URL
      this.fetchProducts();
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['receivedCatId'] || changes['searchTerm']) {
      this.fetchProducts();
    }
  }

  fetchProducts(): void {
    const queryParams = {
      limit: this.limit,
      page: this.currentPage,
      catId: this.receivedCatId === '0' ? '' : this.receivedCatId,
      search: this.searchTerm,
    };
    this._apiProductsService.getAllProducts(queryParams).subscribe({
      next: (res: any) => {
        if (res && res.data && res.data.products) {
          this.products = res.data.products;
          this.filteredProducts = this.products;
          this.totalPages = res.data.totalPages || 1;
          this.currentPage = res.data.currentPage || 1;
        } else {
          console.error('Invalid response structure:', res);
          this.products = [];
          this.filteredProducts = [];
          this.totalPages = 1;
          this.currentPage = 1;
        }
      },
      error: (err) => {
        console.error('Error fetching products:', err.message);
      },
    });
  }
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return; // Prevent invalid page navigation
    this.currentPage = page;
    // Update the URL with the new page number
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge', // Preserve other query parameters
    });
    this.fetchProducts();
  }

  trackItem(index: number, product: IProduct) {
    return product._id;
  }

  buy(count: string, price: number) {
    const requestQuantity = parseInt(count);
    this.cartCount += requestQuantity;

    this.totalOrderPrice += requestQuantity * price;
    this.onTotalPriceChanged.emit(this.totalOrderPrice);

    this.cartService.updateCartCount(this.cartCount);
  }

  decrementQuantity(product: IProduct, count: string) {
    const requestQuantity = parseInt(count);
    if (requestQuantity > product.quantity) {
      return alert("We don't have enough quantity");
    } else {
      return (product.quantity -= requestQuantity);
    }
  }

  deleteProduct(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#8f9dc3',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._apiProductsService.deleteProduct(id).subscribe({
          next: () => {
            this.filteredProducts = this.filteredProducts.filter(
              (product) => product._id !== id
            );
            Swal.fire({
              title: 'Deleted!',
              text: 'Your product has been deleted.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            });
          },
          error: (err) => {
            console.error(err.message);
            Swal.fire('Error', err.message, 'error');
          },
        });
      }
    });
  }
  navigateToDetails(id: string) {
    this.router.navigateByUrl(`/details/${id}`);
  }
  navigateToUpdate(id: string) {
    this.router.navigateByUrl(`/update-product/${id}`);
  }
}
