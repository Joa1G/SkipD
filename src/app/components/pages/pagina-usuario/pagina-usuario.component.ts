import { Component, computed, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatIcon } from '@angular/material/icon';
import { MockedAuthService } from '../../../services/auth/mocked-auth.service';
import { Router, RouterModule } from '@angular/router';
import { DialogComponent } from '../../shared/dialogs/dialog.component';
import { AbstractUsuarioService } from '../../../services/usuario/abstract-usuario.service';
import { UserImageService } from '../../../services/urlState.service';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pagina-usuario.component',
  imports: [
    HeaderComponent,
    MatIcon,
    DialogComponent,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './pagina-usuario.component.html',
  styleUrl: './pagina-usuario.component.scss',
})
export class PaginaUsuarioComponent {
  authService = inject(MockedAuthService);
  userService = inject(AbstractUsuarioService);
  private userImageService = inject(UserImageService);
  private location = inject(Location)

  router = inject(Router);
  isDialogLogoutVisible = false;
  isDialogPremiumVisible = false;
  isDeleteUrlPhotoDialogVisible = false;
  isEditUrlPhotoDialogVisible = false;
  changeUrlPhotoDialogVisible = false;
  submitted = false;
  showSuccessUrlPhotoChangedDialog = false;

  // Use o signal do serviço
  urlImage = this.userImageService.userImageUrl;
  userName: string = this.authService.currentUser()?.nome || 'Usuário';
  isPremiumUser = computed(
    () => this.authService.currentUser()?.isPremium ?? false
  );

  formUrl = new FormGroup({
    url: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user && user.urlFoto) {
      this.userImageService.updateUserImageUrl(user.urlFoto);
    }
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

  deleteUrlPhoto() {
    const user = this.authService.currentUser();
    this.isDeleteUrlPhotoDialogVisible = false;
    if (user) {
      this.userService.updateUrlFoto(user.id, '').subscribe({
        next: (result) => {
          if (result.success) {
            console.log('User image URL deleted successfully');
            // Atualiza o serviço compartilhado
            this.userImageService.clearUserImageUrl();
            // Atualiza o currentUser no authService
            const updatedUser = { ...user, urlFoto: '' };
            this.authService.updateCurrentUser(updatedUser);
            this.changeUrlPhotoDialogVisible = false;
          this.showSuccessUrlPhotoChangedDialog = true;
          } else {
            console.error('Failed to delete user image URL:', result.message);
          }
        },
        error: (error) => {
          console.error('Error deleting user image URL:', error);
        },
      });
    } else {
      console.error('No user is currently logged in.');
    }
  }

  submitUrlPhoto() {
    this.submitted = true;
    if (this.formUrl.valid) {
      const user = this.authService.currentUser();
      if (user) {
        this.userService
          .updateUrlFoto(user.id, this.formUrl.value.url!)
          .subscribe({
            next: (result) => {
              if (result.success) {
                console.log('User image URL updated successfully');

                // Primeiro atualiza o currentUser no authService (persiste no localStorage)
                const updatedUser = {
                  ...user,
                  urlFoto: this.formUrl.value.url!,
                };
                this.authService.updateCurrentUser(updatedUser);

                // Depois atualiza o serviço de imagem
                this.userImageService.updateUserImageUrl(
                  this.formUrl.value.url!
                );

                this.closeEditUrlPhotoDialog();
                this.changeUrlPhotoDialogVisible = false;
                this.showSuccessUrlPhotoChangedDialog = true;
              } else {
                console.error(
                  'Failed to update user image URL:',
                  result.message
                );
              }
            },
            error: (error) => {
              console.error('Error updating user image URL:', error);
            },
          });
      } else {
        console.error('No user is currently logged in.');
      }
    }
  }

  showLogoutDialog() {
    this.isDialogLogoutVisible = true;
  }

  showDeleteUrlPhotoDialog() {
    this.isDeleteUrlPhotoDialogVisible = true;
  }

  showEditUrlPhotoDialog() {
    this.isEditUrlPhotoDialogVisible = true;
  }

  showChangeUrlPhotoDialog() {
    this.changeUrlPhotoDialogVisible = true;
  }

  closeEditUrlPhotoDialog() {
    this.isEditUrlPhotoDialogVisible = false;
    this.formUrl.reset();
    this.submitted = false;
  }

  onClickBackArrow(){
    this.router.navigate(['/home']);
  }
}
