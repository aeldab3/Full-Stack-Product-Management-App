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
  categories: Icategory[] = [
    { id: '1', name: 'Laptop' },
    { id: '2', name: 'Mobile' },
    { id: '3', name: 'Tablet' },
  ];
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
        [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s]{3,30}$')],
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
  }

  updateProduct(): void {
    if (this.updateProductForm.valid) {
      const updatedProduct = this.updateProductForm.value;
      this._apiProductsService.updateProduct(updatedProduct).subscribe({
        next: () => {
          alert('Product updated successfully');
          this.router.navigate(['/products']);
        },
        error: (err) => console.error(err.message),
      });
    }
  }
}
