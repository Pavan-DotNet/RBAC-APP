

import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
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

