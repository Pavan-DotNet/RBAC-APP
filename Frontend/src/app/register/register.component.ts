
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <h2>Register</h2>
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" formControlName="username">
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" formControlName="email">
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" formControlName="password">
      </div>
      <button type="submit" [disabled]="!registerForm.valid">Register</button>
    </form>
  `,
  styles: []
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      this.authService.register(username, email, password).subscribe(
        () => {
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Registration failed', error);
          // TODO: Show error message to user
        }
      );
    }
  }
}
