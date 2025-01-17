import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IProduct } from '../models/iproduct';
import { environment } from '../../environments/environment.development';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiProductsService {
  constructor(
    private httpClient: HttpClient,
    private _UserAuthService: UserAuthService
  ) {}

  getAllProducts(): Observable<IProduct[]> {
    return this.httpClient
      .get<{ data: { products: IProduct[] } }>(
        `${environment.baseUrl}/products`
        /*       , {
      headers: new HttpHeaders({
        authorization: `Bearer ${this._UserAuthService.getToken()}`,
      }),
    } */
      )
      .pipe(map((res) => res.data.products));
  }
  getProductById(id: string): Observable<IProduct> {
    return this.httpClient.get<IProduct>(
      `${environment.baseUrl}/products/${id}`
    );
  }
  getProductByCatId(catId: string): Observable<IProduct[]> {
    let searchString = new HttpParams();
    searchString = searchString.append('catId', catId);
    return this.httpClient.get<IProduct[]>(`${environment.baseUrl}/products`, {
      params: searchString,
    });
  }
  addProduct(product: IProduct): Observable<IProduct> {
    return this.httpClient.post<IProduct>(
      `${environment.baseUrl}/products`,
      product
    );
  }
  updateProduct(product: IProduct): Observable<IProduct> {
    return this.httpClient.patch<IProduct>(
      `${environment.baseUrl}/products/${product._id}`,
      product
    );
  }

  deleteProduct(id: string): Observable<IProduct> {
    return this.httpClient.delete<IProduct>(
      `${environment.baseUrl}/products/${id}`
    );
  }
}
