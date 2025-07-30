import { Component, computed, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatIcon } from '@angular/material/icon';
import { MockedAuthService } from '../../../services/auth/mocked-auth.service';
import { Router } from '@angular/router';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { AbstractUsuarioService } from '../../../services/usuario/abstract-usuario.service';

@Component({
  selector: 'app-pagina-usuario.component',
  imports: [HeaderComponent, MatIcon, DialogComponent],
  templateUrl: './pagina-usuario.component.html',
  styleUrl: './pagina-usuario.component.scss',
})
export class PaginaUsuarioComponent {
  authService = inject(MockedAuthService);
  userService = inject(AbstractUsuarioService);

  router = inject(Router);
  isDialogLogoutVisible = false;
  isDialogPremiumVisible = false;
  urlImage: string = '';
  userName: string = this.authService.currentUser()?.nome || 'Usuário';
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  changePremiumStateOfUser() {
  const user = this.authService.currentUser();
  if (user) {
    this.userService.changePremiumState(user.id).subscribe({
      next: (result) => {
        if (result.success) {
          console.log('Premium state changed successfully');

          this.authService.updateCurrentUser(result.data);

          this.isDialogPremiumVisible = true;
        } else {
          console.error('Failed to change premium state:', result.message);
        }
      },
      error: (error) => {
        console.error('Error changing premium state:', error);
      },
    });
  } else {
    console.error('No user is currently logged in.');
  }
}

  showLogoutDialog() {
    this.isDialogLogoutVisible = true;
  }
}
