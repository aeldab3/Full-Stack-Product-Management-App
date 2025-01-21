import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../../models/iproduct';
import { CommonModule, Location } from '@angular/common';
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
  idsArr!: string[];
  currentIdIndex: number = 0;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _location: Location,
    private _router: Router,
    private _apiProductsService: ApiProductsService
  ) {
    const queryParams = { limit: 10000000, page: 1 };
    this._apiProductsService.getAllProducts(queryParams).subscribe({
      next: (res: any) => {
        this.idsArr = res.map((product: IProduct) => product._id);
      },
      error: (err) => console.error(err.message),
    });
  }
  ngOnInit(): void {
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
  goBack() {
    this._location.back();
  }
  next() {
    this.currentIdIndex = this.idsArr.findIndex((id) => id == this.id);
    if (this.currentIdIndex != this.idsArr.length - 1) {
      const nextProductId = this.idsArr[this.currentIdIndex + 1];
      this._router.navigateByUrl(`/details/${nextProductId}`);
    }
  }
  prev() {
    this.currentIdIndex = this.idsArr.findIndex((id) => id == this.id);
    if (this.currentIdIndex != 0) {
      const prevProductId = this.idsArr[this.currentIdIndex - 1];
      this._router.navigateByUrl(`/details/${prevProductId}`);
    }
  }
}
