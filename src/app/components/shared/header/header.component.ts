import { Component, computed, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MockedAuthService } from '../../../services/auth/mocked-auth.service';
import { Router } from '@angular/router';
import { AbstractUsuarioService } from '../../../services/usuario/abstract-usuario.service';
import { UserImageService } from '../../../services/urlState.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatToolbarModule,
    DialogComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authService = inject(MockedAuthService);
  private userService = inject(AbstractUsuarioService);
  private userImageService = inject(UserImageService);
  urlImage = this.userImageService.userImageUrl;

  isPremiumUser = computed(() => this.authService.currentUser()?.isPremium ?? false);
  showPremiumDialog = false;

  ngOnInit() {
    this.getUserUrlImage();
  }

  getUserUrlImage() {
    const user = this.authService.currentUser();
    if (user) {
      this.userService.getUrlFotoById(user.id).subscribe({
        next: (result) => {
          if (result.success && result.data) {
            console.log('User image URL:', result.data);
            this.userImageService.updateUserImageUrl(result.data);
          } else {
            console.error('Failed to get user image URL:', result.message);
            this.userImageService.clearUserImageUrl();
          }
        },
        error: (error) => {
          console.error('Error fetching user image:', error);
          this.userImageService.clearUserImageUrl();
        },
      });
    } else {
      console.error('No user is currently logged in.');
      this.userImageService.clearUserImageUrl();
    }
  }

  showPremiumMessage() {
    this.showPremiumDialog = true;
  }
  
}
