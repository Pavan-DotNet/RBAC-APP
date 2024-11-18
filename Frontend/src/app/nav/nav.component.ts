
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  template: `
    <nav>
      <ul>
        <li><a routerLink="/user" routerLinkActive="active">User Dashboard</a></li>
        <li *ngIf="isAdmin"><a routerLink="/admin" routerLinkActive="active">Admin Dashboard</a></li>
        <li><a href="#" (click)="logout()">Logout</a></li>
      </ul>
    </nav>
  `,
  styles: [`
    nav { background-color: #f8f9fa; padding: 10px; }
    ul { list-style-type: none; padding: 0; }
    li { display: inline; margin-right: 10px; }
    a { text-decoration: none; color: #007bff; }
    a:hover { text-decoration: underline; }
    .active { font-weight: bold; }
  `]
})
export class NavComponent implements OnInit {
  isAdmin = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getUserRoles().subscribe(roles => {
      this.isAdmin = roles.includes('Admin');
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
