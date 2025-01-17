import { Component } from '@angular/core';
import { UserAuthService } from '../../../services/user-auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  isUserLogged: boolean;
  errorMessage: string | null = null;
  constructor(
    private _userAuthService: UserAuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.isUserLogged = this._userAuthService.getUserLogged();
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
    const { email, password } = this.loginForm.value;
    this._userAuthService
      .login(email, password)
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.isUserLogged = this._userAuthService.getUserLogged();
          this.router.navigate(['/products']);
        } else {
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      });
  }
}
