import { Component, OnInit } from '@angular/core';
import { ApiProductsService } from '../../services/api-products.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IProduct } from '../../models/iproduct';
import { Icategory } from '../../models/icategory';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-product',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css',
})
export class UpdateProductComponent implements OnInit {
  categories: { _id: string; name: string }[] = [];
  product: IProduct = {} as IProduct;
  updateProductForm: FormGroup;
  constructor(
    private _apiProductsService: ApiProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.updateProductForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s\\-_]{3,50}$')],
      ],
      price: [0, [Validators.required, Validators.min(1)]],
      description: ['', Validators.maxLength(200)],
      quantity: [0, [Validators.min(0)]],
      imageUrl: [''],
      catId: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    const productId = this.route.snapshot.params['id'];
    this._apiProductsService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.updateProductForm.patchValue({
          name: product.name,
          price: product.price,
          description: product.description,
          quantity: product.quantity,
          imageUrl: product.imageUrl,
          catId: product.catId,
        });
      },
      error: (err) => {
        console.error(err.message);
      },
    });

    this._apiProductsService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data.categories;
      },
      error: (err) => console.error('Error fetching categories:', err),
    });
  }

  updateProduct(): void {
    if (this.updateProductForm.valid) {
      const updatedProduct = new FormData();
      Object.entries(this.updateProductForm.value).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          updatedProduct.append(key, value as string | Blob);
        }
      });

      const fileInput: HTMLInputElement = document.getElementById(
        'productImage'
      ) as HTMLInputElement;
      const file = fileInput.files?.[0];
      if (file) {
        updatedProduct.append('imageUrl', file);
      } else {
        updatedProduct.append('imageUrl', this.product.imageUrl);
      }
      this._apiProductsService
        .updateProduct(this.product._id, updatedProduct)
        .subscribe({
          next: () => {
            alert('Product updated successfully');
            this.router.navigate(['/products']);
          },
          error: (err) => {
            console.error(err.message);
            alert('Failed to update product. Please try again.');
          },
        });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
