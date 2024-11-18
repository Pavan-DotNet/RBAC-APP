
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>RBAC App</h1>
    <app-nav *ngIf="authService.isLoggedIn()"></app-nav>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'RBAC-APP';

  constructor(public authService: AuthService) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.authService.loadUserRoles();
    }
  }
}
