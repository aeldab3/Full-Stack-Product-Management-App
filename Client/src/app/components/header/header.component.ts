import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserAuthService } from '../../services/user-auth.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isUserLoggedIn!: boolean;
  name!: string;
  cartCount: number = 0;
  constructor(
    private _userAuthService: UserAuthService,
    private router: Router,
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    this._userAuthService.getAuthSubject().subscribe({
      next: (response) => {
        this.isUserLoggedIn = response;
        if (this.isUserLoggedIn) {
          this.name = this._userAuthService.getUserName() || 'user';
        }
      },
    });
    this.cartService.getCartCount().subscribe((count) => {
      this.cartCount = count;
    });
  }
  logout(): void {
    let confirmation = confirm('Are you sure you want to logout?');
    if (confirmation) {
      this._userAuthService.logout();
      this.isUserLoggedIn = this._userAuthService.getUserLogged();
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/order']);
    }
  }
}
