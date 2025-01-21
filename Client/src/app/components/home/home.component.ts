import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserAuthService } from '../../services/user-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  isLoggedIn: boolean = false;
  constructor(private _userAuthService: UserAuthService) {
    this._userAuthService.getAuthSubject().subscribe((res) => {
      this.isLoggedIn = res;
    });
  }
}
