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
import { HighlightCardDirective } from '../../directives/highlight-card.directive';
import { StaticProductsService } from '../../services/static-products.service';
import { Router } from '@angular/router';
import { ApiProductsService } from '../../services/api-products.service';

@Component({
  selector: 'app-products',
  imports: [FormsModule, CommonModule, HighlightCardDirective],
  standalone: true,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnChanges, OnInit {
  products: IProduct[] = [] as IProduct[];
  filteredProducts: IProduct[];
  totalOrderPrice: number = 0;

  @Input() receivedCatId: string = '';
  @Output() onTotalPriceChanged: EventEmitter<number>;
  constructor(
    private _StaticProductsService: StaticProductsService,
    private router: Router,
    private _apiProductsService: ApiProductsService
  ) {
    // this.products = this._StaticProductsService.getAllProducts();
    this.filteredProducts = this.products;
    this.onTotalPriceChanged = new EventEmitter<number>();
  }
  ngOnInit(): void {
    this._apiProductsService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = this.products;
      },
      error: (err) => {
        console.error(err.message);
      },
    });
  }
  ngOnChanges() {
    if (this.receivedCatId == '') {
      this._apiProductsService.getAllProducts().subscribe({
        next: (data) => {
          this.filteredProducts = data;
        },
        error: (err) => {
          console.error(err.message);
        },
      });
    } else {
      this._apiProductsService.getProductByCatId(this.receivedCatId).subscribe({
        next: (res) => {
          this.filteredProducts = res;
        },
        error: (err) => {
          console.error(err.message);
        },
      });
    }
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
  navigateToDetails(id: string, name: string) {
    this.router.navigateByUrl(`/details/${id}/${name}`);
  }
  navigateToUpdate(id: string, name: string) {
    this.router.navigateByUrl(`/update-product/${id}/${name}`);
  }
}
