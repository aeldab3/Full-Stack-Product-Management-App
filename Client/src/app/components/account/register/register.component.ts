import { UserAuthService } from './../../../services/user-auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  userRegisterForm: FormGroup;
  errorMessage: string | null = null;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _userAuthService: UserAuthService
  ) {
    this.userRegisterForm = fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern('^([a-zA-Z0-9]{3,30})$')],
      ],
      email: ['', [Validators.required, Validators.email]],
      phoneNumbers: fb.array([
        ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
      ]),
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
          ),
        ],
      ],
      confirmPassword: ['', [Validators.required, this.passwordMatchValidator]],
    });
    this.userRegisterForm.get('password')?.valueChanges.subscribe(() => {
      this.userRegisterForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  onRegister(): void {
    if (this.userRegisterForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
    const { name, email, phoneNumbers, password, confirmPassword } =
      this.userRegisterForm.value;

    if (password !== this.userRegisterForm.value.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    this._userAuthService
      .register({
        name,
        email,
        phones: phoneNumbers,
        password,
        confirmPassword,
        role: 'user',
      })
      .subscribe(
        (success) => {
          if (success) {
            alert('Registration successful!');
            this.router.navigate(['/login']);
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        },
        (error) => {
          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        }
      );
  }
  get name() {
    return this.userRegisterForm.get('name');
  }

  get email() {
    return this.userRegisterForm.get('email');
  }

  get phones() {
    return this.userRegisterForm.get('phoneNumbers') as FormArray;
  }
  get password() {
    return this.userRegisterForm.get('password');
  }

  get confirmPassword() {
    return this.userRegisterForm.get('confirmPassword');
  }
  addPhoneNum() {
    if (this.phones.length >= 2) {
      alert('You can have a maximum of 2 phone numbers.');
      return;
    }
    this.phones.push(this.fb.control('', [Validators.pattern('^[0-9]{11}$')]));
  }
  removePhoneNum(index: number) {
    if (this.phones.length > 1) {
      this.phones.removeAt(index);
    }
  }

  passwordMatchValidator = (
    control: FormControl
  ): { [key: string]: boolean } | null => {
    const password = this.userRegisterForm?.get('password')?.value;
    if (password && control.value !== password) {
      return { passwordMismatch: true };
    }
    return null;
  };
}
