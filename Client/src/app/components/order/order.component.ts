import { CommonModule } from '@angular/common';
import { Icategory } from './../../models/icategory';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsComponent } from '../products/products.component';
import { ApiProductsService } from '../../services/api-products.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-order',
  imports: [CommonModule, FormsModule, ProductsComponent],
  standalone: true,
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit {
  categories: Icategory[] = [];
  selectedCatId: string = '0';
  searchTerm: string = '';
  receivedTotalPrice: number = 0;
  cartCount: number = 0;

  constructor(
    private _apiProductsService: ApiProductsService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.cartService.getCartCount().subscribe((count) => {
      this.cartCount = count;
    });
  }

  fetchCategories(): void {
    this._apiProductsService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data.categories;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  onCategoryChange(): void {}

  onSearch(): void {}

  calcTotalPrice(totalPrice: number): void {
    this.receivedTotalPrice = totalPrice;
  }
}
