import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IProduct } from '../models/iproduct';
import { environment } from '../../environments/environment.development';
import { UserAuthService } from './user-auth.service';
import { Icategory } from '../models/icategory';

@Injectable({
  providedIn: 'root',
})
export class ApiProductsService {
  constructor(
    private httpClient: HttpClient,
    private _UserAuthService: UserAuthService
  ) {}

  getAllProducts(queryParams: any): Observable<any> {
    return this.httpClient.get<any>(`${environment.baseUrl}/products`, {
      params: queryParams,
    });
  }

  getProductById(id: string): Observable<IProduct> {
    return this.httpClient
      .get<{ data: { product: IProduct } }>(
        `${environment.baseUrl}/products/${id}`
      )
      .pipe(map((res) => res.data.product));
  }

  getCategories(): Observable<any> {
    return this.httpClient.get<{ data: { categories: any } }>(
      `${environment.baseUrl}/products/categories`
    );
  }

  getProductByCatId(catId: string): Observable<IProduct[]> {
    let searchString = new HttpParams();
    searchString = searchString.append('catId', catId);
    return this.httpClient.get<IProduct[]>(`${environment.baseUrl}/products`, {
      params: searchString,
    });
  }
  addProduct(product: FormData): Observable<IProduct> {
    return this.httpClient
      .post<{ data: { product: IProduct } }>(
        `${environment.baseUrl}/products`,
        product
      )
      .pipe(map((res) => res.data.product));
  }
  updateProduct(
    productId: string,
    updatedProduct: FormData
  ): Observable<IProduct> {
    return this.httpClient
      .patch<{ data: { product: IProduct } }>(
        `${environment.baseUrl}/products/${productId}`,
        updatedProduct
      )
      .pipe(map((res) => res.data.product));
  }

  deleteProduct(id: string): Observable<IProduct> {
    return this.httpClient.delete<IProduct>(
      `${environment.baseUrl}/products/${id}`
    );
  }
}
