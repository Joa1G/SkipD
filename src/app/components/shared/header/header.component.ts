import { Component, computed, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MockedAuthService } from '../../../services/auth/mocked-auth.service';
import { Router } from '@angular/router';
import { AbstractUsuarioService } from '../../../services/usuario/abstract-usuario.service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authService = inject(MockedAuthService);
  private userService = inject(AbstractUsuarioService);
  urlImage: string = '';

  isPremiumUser = computed(() => this.authService.currentUser()?.isPremium ?? false);

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
            this.urlImage = result.data;
          } else {
            console.error('Failed to get user image URL:', result.message);
            this.urlImage = '';
          }
        },
        error: (error) => {
          console.error('Error fetching user image:', error);
          this.urlImage = '';
        },
      });
    } else {
      console.error('No user is currently logged in.');
      this.urlImage = '';
    }
  }
}
