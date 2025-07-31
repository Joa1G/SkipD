import { Component, computed, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatIcon } from '@angular/material/icon';
import { Location } from '@angular/common';
import { MockedAuthService } from '../../../services/auth/mocked-auth.service';
import { AbstractUsuarioService } from '../../../services/usuario/abstract-usuario.service';
import { DialogComponent } from '../../shared/dialogs/dialog.component';
import { Router } from '@angular/router';
import { emailInUseValidator } from '../cadastro/cadastro.component';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { passwordMatchValidator } from '../cadastro/cadastro.component';
import { catchError, map, of } from 'rxjs';

export const oldPasswordMatchValidator = (authService: MockedAuthService): AsyncValidatorFn => {
  return (control: AbstractControl) => {
    if (!control.value) {
      return of(null);
    }
    // Supondo que o serviço tenha um método para verificar a senha
    return authService.verifyPassword(control.value).pipe(
      map(isMatch => (isMatch ? null : { oldPasswordIncorrect: true })),
      catchError(() => of({ oldPasswordIncorrect: true }))
    );
  };
};

@Component({
  selector: 'app-conta-settings',
  imports: [HeaderComponent, MatIcon, DialogComponent, ReactiveFormsModule],
  templateUrl: './conta-settings.component.html',
  styleUrl: './conta-settings.component.scss',
})
export class ContaSettingsComponent {
  private location = inject(Location);
  private authService = inject(MockedAuthService);
  private userService = inject(AbstractUsuarioService);
  private router = inject(Router);
  showCancelPremiumDialog = false;
  showDeleteAccountDialog = false;
  isEditNameDialogVisible = false;
  submittedName = false;
  isEditEmailDialogVisible = false;
  submittedEmail = false;
  isEditPasswordDialogVisible = false;
  submittedPassword = false;
  showPassword = false;
  showSucessEditNameDialog = false;
  showSucessEditEmailDialog = false;
  showSucessEditPasswordDialog = false;

  formName = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
  });

  formEmail = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email], [emailInUseValidator(this.userService)]),
  });

  formPassword = new FormGroup(
    {
      old_password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ], [oldPasswordMatchValidator(this.authService)]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator }
  );

  user = computed(() => this.authService.currentUser());
  isPremiumUser = computed(
    () => this.authService.currentUser()?.isPremium ?? false
  );

  onClickBackArrow() {
    this.location.back();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
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

  closeEditNameDialog() {
    this.isEditNameDialogVisible = false;
    this.formName.reset();
    this.submittedName = false;
  }

  submitNameChange() {
    this.submittedName = true;
    if (this.formName.invalid) {
      return;
    }

    const user = this.authService.currentUser();
    const updatedUser = {
      ...user!,
      nome: this.formName.value.name!,
    };
    if (user) {
      this.userService.updateUsuario(updatedUser).subscribe({
        next: (result) => {
          if (result.success) {
            console.log('Name updated successfully');
            this.authService.updateCurrentUser(result.data);
            this.isEditNameDialogVisible = false;
            this.formName.reset();
            this.submittedName = false;
            this.showSucessEditNameDialog = true;
          } else {
            console.error('Failed to update name:', result.message);
          }
        },
        error: (error) => {
          console.error('Error updating name:', error);
        },
      });
    } else {
      console.error('No user is currently logged in.');
    }
  }

  closeEditEmailDialog() {
    this.isEditEmailDialogVisible = false;
    this.formEmail.reset();
    this.submittedEmail = false;
  }

  submitEmailChange() {
    this.submittedEmail = true;
    if (this.formEmail.invalid) {
      return;
    }

    const user = this.authService.currentUser();
    const updatedUser = {
      ...user!,
      email: this.formEmail.value.email!,
    };
    if (user) {
      this.userService.updateUsuario(updatedUser).subscribe({
        next: (result) => {
          if (result.success) {
            console.log('Email updated successfully');
            this.authService.updateCurrentUser(result.data);
            this.isEditEmailDialogVisible = false;
            this.formEmail.reset();
            this.submittedEmail = false;
            this.showSucessEditEmailDialog = true;
          } else {
            console.error('Failed to update email:', result.message);
          }
        },
        error: (error) => {
          console.error('Error updating email:', error);
        },
      });
    } else {
      console.error('No user is currently logged in.');
    }
  }

  closeEditPasswordDialog() {
    this.isEditPasswordDialogVisible = false;
    this.formPassword.reset();
    this.submittedPassword = false;
  }

  submitPasswordChange() {
    this.submittedPassword = true;
    if (this.formPassword.invalid) {
      return;
    }

    const user = this.authService.currentUser();
    const updatedUser = {
      ...user!,
      senha: this.formPassword.value.password!,
    };
    if (user) {
      this.userService.updateUsuario(updatedUser).subscribe({
        next: (result) => {
          if (result.success) {
            console.log('Password updated successfully');
            this.authService.updateCurrentUser(result.data);
            this.isEditPasswordDialogVisible = false;
            this.formPassword.reset();
            this.submittedPassword = false;
            this.showSucessEditPasswordDialog = true;
          } else {
            console.error('Failed to update password:', result.message);
          }
        },
        error: (error) => {
          console.error('Error updating password:', error);
        },
      });
    } else {
      console.error('No user is currently logged in.');
    }
  }
}
