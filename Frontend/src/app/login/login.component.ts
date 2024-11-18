
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <h2>Login</h2>
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" formControlName="username">
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" formControlName="password">
      </div>
      <button type="submit" [disabled]="!loginForm.valid">Login</button>
    </form>
  `,
  styles: []
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe(
        () => {
          this.router.navigate(['/user']);
        },
        (error) => {
          console.error('Login failed', error);
          // TODO: Show error message to user
        }
      );
    }
  }
}
