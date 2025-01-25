import { Component, OnInit } from '@angular/core';
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
export class AddProductComponent implements OnInit {
  addProductForm!: FormGroup;
  categories: Icategory[] = [];
  constructor(
    private fb: FormBuilder,
    private _apiProductsService: ApiProductsService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.addProductForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s\\-_]{3,50}$')],
      ],
      price: [1, [Validators.required, Validators.min(1)]],
      quantity: [1, [Validators.min(0)]],
      imageUrl: [''],
      catId: ['', Validators.required],
      description: ['', Validators.maxLength(200)],
    });

    this._apiProductsService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data.categories;
      },
      error: (err) => console.error('Error fetching categories:', err),
    });
  }
  addNewProduct() {
    if (this.addProductForm.valid) {
      const formData = new FormData();

      formData.append('name', this.addProductForm.get('name')?.value);
      formData.append(
        'price',
        this.addProductForm.get('price')?.value.toString()
      );
      formData.append(
        'quantity',
        this.addProductForm.get('quantity')?.value.toString()
      );
      formData.append('catId', this.addProductForm.get('catId')?.value);
      formData.append(
        'description',
        this.addProductForm.get('description')?.value
      );

      const fileInput: HTMLInputElement = document.getElementById(
        'productImage'
      ) as HTMLInputElement;
      const file = fileInput.files?.[0];
      if (file) {
        formData.append('imageUrl', file);
      } else {
        alert('Please select an image file');
        return;
      }

      this._apiProductsService.addProduct(formData).subscribe({
        next: () => {
          alert('Product added successfully');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Error adding product:', err);
          alert('Failed to add the product. Please try again.');
        },
      });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
  onReset() {
    this.addProductForm.reset();
  }
}
