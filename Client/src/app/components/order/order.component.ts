import { CommonModule } from '@angular/common';
import { Icategory } from './../../models/icategory';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-order',
  imports: [CommonModule, FormsModule, ProductsComponent],
  standalone: true,
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements AfterViewInit {
  categories: Icategory[];
  selectedCatId: string = '';
  receivedTotalPrice: number = 0;
  @ViewChild('userNameInp') myInp!: ElementRef;
  constructor() {
    this.categories = [
      { id: '1', name: 'Laptop' },
      { id: '2', name: 'Mobile' },
      { id: '3', name: 'Tablet' },
    ];
  }
  ngAfterViewInit(): void {
    this.myInp.nativeElement.value = 'ahmed';
  }
  calcTotalPrice(totalPrice: number) {
    this.receivedTotalPrice = totalPrice;
  }
}
