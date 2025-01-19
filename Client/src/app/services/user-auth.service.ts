import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

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
      .post<{ status: string; data: { token: string } }>(
        `${environment.baseUrl}/users/login`,
        {
          email,
          password,
        }
      )
      .pipe(
        map((res) => {
          localStorage.setItem('token', res.data.token);
          this.authSubject.next(true);
          return true;
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
    return this.http.post<{ status: string; data: { user: any } }>(
      `${environment.baseUrl}/users/register`,
      userData
    ).pipe(
      tap((response) => {
        if (response.status === 'SUCCESS') {
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

  getUserLogged(): boolean {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token') ? true : false;
    }
    return false;
  }
  getToken() {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token') ? localStorage.getItem('token') : '';
    }
    return '';
  }

  getAuthSubject(): BehaviorSubject<boolean> {
    return this.authSubject;
  }
}
