import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StaticProductsService } from '../../services/static-products.service';
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
  idsArr: string[];
  currentIdIndex: number = 0;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _StaticProductsService: StaticProductsService,
    private _location: Location,
    private _router: Router,
    private _apiProductsService: ApiProductsService
  ) {
    this.idsArr = this._StaticProductsService.mapProductsToIds();
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
      const nextProductName =
        this._StaticProductsService
          .getProductById(nextProductId)
          ?.name.toLowerCase() || '';
      this._router.navigateByUrl(
        `/details/${nextProductId}/${nextProductName}`
      );
    }
  }
  prev() {
    this.currentIdIndex = this.idsArr.findIndex((id) => id == this.id);
    if (this.currentIdIndex != 0) {
      const prevProductId = this.idsArr[this.currentIdIndex - 1];
      const prevProductName =
        this._StaticProductsService
          .getProductById(prevProductId)
          ?.name.toLowerCase() || '';
      this._router.navigateByUrl(
        `/details/${prevProductId}/${prevProductName}`
      );
    }
  }
}
