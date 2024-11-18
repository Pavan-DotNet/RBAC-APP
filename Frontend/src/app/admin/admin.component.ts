
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin',
  template: `
    <h2>Admin Dashboard</h2>
    <p>Welcome to the admin dashboard. Here you can manage users and roles.</p>
    <div>
      <h3>User Management</h3>
      <ul>
        <li *ngFor="let user of users">
          {{ user.username }} - {{ user.email }}
          <button (click)="assignRole(user.id, 'Admin')">Make Admin</button>
          <button (click)="assignRole(user.id, 'User')">Make User</button>
        </li>
      </ul>
    </div>
    <div>
      <h3>Create New Role</h3>
      <input [(ngModel)]="newRoleName" placeholder="Enter role name">
      <button (click)="createRole()">Create Role</button>
    </div>
    <div *ngIf="error" class="error">
      {{ error }}
    </div>
  `,
  styles: [`
    .error { color: red; }
  `]
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  newRoleName: string = '';
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        this.error = 'Failed to load users. Please try again later.';
        console.error('Error loading users:', error);
      }
    );
  }

  assignRole(userId: number, role: string) {
    this.adminService.assignRole(userId, role).subscribe(
      () => {
        console.log(`Role ${role} assigned to user ${userId}`);
        this.loadUsers(); // Reload users to reflect changes
      },
      (error) => {
        this.error = `Failed to assign role ${role} to user ${userId}. Please try again.`;
        console.error('Error assigning role:', error);
      }
    );
  }

  createRole() {
    if (this.newRoleName) {
      this.adminService.createRole(this.newRoleName).subscribe(
        () => {
          console.log(`New role created: ${this.newRoleName}`);
          this.newRoleName = '';
        },
        (error) => {
          this.error = `Failed to create role ${this.newRoleName}. Please try again.`;
          console.error('Error creating role:', error);
        }
      );
    }
  }
}
