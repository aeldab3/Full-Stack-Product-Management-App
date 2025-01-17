import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private authSubject: BehaviorSubject<boolean>;
  constructor() {
    this.authSubject = new BehaviorSubject<boolean>(false);
  }

  login(email: string, password: string): Observable<boolean> {
    if (email === 'eldab3@gmail.com' && password === 'Aa010Aa@') {
      localStorage.setItem('token', 'eldab3eldab3');
      this.authSubject.next(true);
      return of(true);
    }
    return of(false);
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
