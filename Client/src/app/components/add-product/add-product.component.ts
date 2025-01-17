import { Component } from '@angular/core';
import { Icategory } from '../../models/icategory';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IProduct } from '../../models/iproduct';
import { ApiProductsService } from '../../services/api-products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent {
  addProductForm: FormGroup;
  categories: Icategory[] = [
    { id: '1', name: 'Laptop' },
    { id: '2', name: 'Mobile' },
    { id: '3', name: 'Tablet' },
  ];
  constructor(
    private fb: FormBuilder,
    private _apiProductsService: ApiProductsService,
    private router: Router
  ) {
    this.addProductForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s]{3,30}$')],
      ],
      price: [0, [Validators.required, Validators.min(1)]],
      quantity: [0, [Validators.min(0)]],
      imageUrl: [''],
      catId: [0, Validators.required],
      description: ['', Validators.maxLength(200)],
    });
  }
  addNewProduct() {
    if (this.addProductForm.valid) {
      const newProduct = this.addProductForm.value;
      this._apiProductsService.addProduct(newProduct).subscribe({
        next: () => {
          alert('Product added successfully');
          this.router.navigate(['/products']);
        },
        error: (err) => console.error(err.message),
      });
    }
  }
  onReset() {
    this.addProductForm.reset();
  }
}
