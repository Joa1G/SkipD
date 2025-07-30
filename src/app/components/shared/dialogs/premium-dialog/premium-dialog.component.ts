import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MockedAuthService } from '../../../../services/auth/mocked-auth.service';
import { AbstractUsuarioService } from '../../../../services/usuario/abstract-usuario.service';
import { DialogComponent } from '../dialog.component';

@Component({
  selector: 'app-premium-dialog',
  imports: [MatIcon, DialogComponent],
  templateUrl: './premium-dialog.component.html',
  styleUrl: './premium-dialog.component.scss'
})
export class PremiumDialogComponent {

  @Output() visibleChange = new EventEmitter<boolean>();
  private authService = inject(MockedAuthService)
  private userService = inject(AbstractUsuarioService);
  isDialogPremiumVisible = false;

  closeDialog(): void {
    this.visibleChange.emit(false);
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


}
