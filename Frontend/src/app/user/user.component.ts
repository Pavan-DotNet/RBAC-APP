
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  template: `
    <h2>User Dashboard</h2>
    <p>Welcome to your user dashboard. Here you can view your profile and manage your account.</p>
    <div *ngIf="userProfile">
      <h3>Your Profile</h3>
      <p><strong>Username:</strong> {{ userProfile.username }}</p>
      <p><strong>Email:</strong> {{ userProfile.email }}</p>
      <!-- Add more profile information as needed -->
    </div>
    <div *ngIf="error">
      <p class="error">{{ error }}</p>
    </div>
  `,
  styles: [`
    .error { color: red; }
  `]
})
export class UserComponent implements OnInit {
  userProfile: any;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.userService.getUserProfile().subscribe(
      (profile) => {
        this.userProfile = profile;
      },
      (error) => {
        this.error = 'Failed to load user profile. Please try again later.';
        console.error('Error loading user profile:', error);
      }
    );
  }
}
