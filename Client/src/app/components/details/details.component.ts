import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../../models/iproduct';
import { CommonModule } from '@angular/common';
import { ApiProductsService } from '../../services/api-products.service';

@Component({
  selector: 'app-details',
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  id!: string;
  name!: string;
  product: IProduct | null = null;
  idsArr: String[] = [];
  currentIdIndex: number = 0;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _apiProductsService: ApiProductsService
  ) {}
  ngOnInit(): void {
    this._apiProductsService.getAllProductsId().subscribe({
      next: (ids) => {
        this.idsArr = ids;
      },
      error: (err) => {
        console.error('Error loading IDs:', err.message);
      },
    });

    this._activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id') ?? '';
      this._apiProductsService.getProductById(this.id).subscribe({
        next: (res) => {
          this.product = res;
        },
        error: (err) => {
          console.error(err.message);
        },
      });
    });
  }
  next() {
    this.currentIdIndex = this.idsArr.findIndex((id) => id == this.id);
    if (this.currentIdIndex < this.idsArr.length - 1) {
      const nextProductId = this.idsArr[this.currentIdIndex + 1];
      this._router.navigateByUrl(`/details/${nextProductId}`);
    }
  }
  prev() {
    this.currentIdIndex = this.idsArr.findIndex((id) => id == this.id);
    if (this.currentIdIndex > 0) {
      const prevProductId = this.idsArr[this.currentIdIndex - 1];
      this._router.navigateByUrl(`/details/${prevProductId}`);
    }
  }
}
