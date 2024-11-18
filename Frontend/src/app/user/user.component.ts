

import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
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

