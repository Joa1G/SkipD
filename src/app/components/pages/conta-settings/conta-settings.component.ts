import { Component, computed, inject } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { MatIcon } from '@angular/material/icon';
import { Location } from '@angular/common';
import { MockedAuthService } from '../../../services/auth/mocked-auth.service';
import { AbstractUsuarioService } from '../../../services/usuario/abstract-usuario.service';
import { DialogComponent } from '../../shared/dialogs/dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conta-settings',
  imports: [HeaderComponent, MatIcon, DialogComponent],
  templateUrl: './conta-settings.component.html',
  styleUrl: './conta-settings.component.scss'
})
export class ContaSettingsComponent {
  private location = inject(Location);
  private authService = inject(MockedAuthService);
  private userService = inject(AbstractUsuarioService);
  private router = inject(Router);
  showCancelPremiumDialog = false;
  showDeleteAccountDialog = false;

  user = this.authService.currentUser();
  isPremiumUser = computed(
    () => this.authService.currentUser()?.isPremium ?? false
  );

  onClickBackArrow() {
    this.location.back();
  }

  changePremiumStateOfUser() {
    const user = this.authService.currentUser();
    if (user) {
      this.userService.changePremiumState(user.id).subscribe({
        next: (result) => {
          if (result.success) {
            console.log('Premium state changed successfully');

            this.authService.updateCurrentUser(result.data);

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

  deleteAccount() {
    const user = this.authService.currentUser();
    if (user) {
      this.userService.deleteUsuario(user.id).subscribe({
        next: (result) => {
          if (result.success) {
            console.log('Account deleted successfully');
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            console.error('Failed to delete account:', result.message);
          }
        },
        error: (error) => {
          console.error('Error deleting account:', error);
        },
      });
    } else {
      console.error('No user is currently logged in.');
    }
  }

  openCancelPremiumDialog() {
    this.showCancelPremiumDialog = true;
  }

  openDeleteAccountDialog() {
    this.showDeleteAccountDialog = true;
  }
}
