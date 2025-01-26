import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ILoginResponse } from '../models/iLoginResponse';
import { IRegisterResponse } from '../models/IRegisterResponse';
@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private authSubject: BehaviorSubject<boolean>;
  constructor(private http: HttpClient) {
    this.authSubject = new BehaviorSubject<boolean>(this.getUserLogged());
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<ILoginResponse>(`${environment.baseUrl}/users/login`, {
        email,
        password,
      })
      .pipe(
        map((res) => {
          if (!this.isTokenExpired(res.data.token)) {
            localStorage.setItem('token', res.data.token);
            this.authSubject.next(true);
            return true;
          } else {
            console.error('Token is already expired.');
            return false;
          }
        }),
        catchError((err) => {
          this.authSubject.next(false);
          console.error('Login failed:', err.message);
          return of(false);
        })
      );
  }

  register(userData: {
    name: string;
    email: string;
    phones: string[];
    password: string;
    confirmPassword: string;
    role: string;
  }): Observable<boolean> {
    return this.http
      .post<IRegisterResponse>(
        `${environment.baseUrl}/users/register`,
        userData
      )
      .pipe(
        tap((res) => {
          console.log('Registration response:', res);
          if (res.status === 'SUCCESS') {
            alert('Registration successful!');
          }
        }),
        map(() => true),
        catchError(() => of(false))
      );
  }
  logout() {
    localStorage.removeItem('token');
    this.authSubject.next(false);
  }

  getUserName(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.name || payload.email;
    }
    return null;
  }

  private isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  }
  getUserLogged(): boolean {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        return token ? !this.isTokenExpired(token) : false;
      }
    }
    return false;
  }
  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  getAuthSubject(): BehaviorSubject<boolean> {
    return this.authSubject;
  }
}
