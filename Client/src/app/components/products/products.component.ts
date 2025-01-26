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

  @Input() receivedCatId: string = '0';
  @Input() searchTerm: string = '';
  @Output() onTotalPriceChanged: EventEmitter<number>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _apiProductsService: ApiProductsService
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
    this.totalOrderPrice += parseInt(count) * price;
    this.onTotalPriceChanged.emit(this.totalOrderPrice);
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
    const confirmation = confirm(
      'Are you sure you want to delete this product?'
    );
    if (!confirmation) return;
    this._apiProductsService.deleteProduct(id).subscribe({
      next: () => {
        this.filteredProducts = this.filteredProducts.filter(
          (product) => product._id !== id
        );
      },
      error: (err) => {
        console.error(err.message);
      },
    });
  }
  navigateToDetails(id: string) {
    this.router.navigateByUrl(`/details/${id}`);
  }
  navigateToUpdate(id: string) {
    this.router.navigateByUrl(`/update-product/${id}`);
  }
}
