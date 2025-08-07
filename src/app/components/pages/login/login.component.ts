import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormsModule,
  FormControl,
} from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { OperationResult } from '../../../models/operation-result.model';
import { AbstractUsuarioService } from '../../../services/usuario/abstract-usuario.service';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../services/auth/auth.service';
import { UsuarioLogin } from '../../../models/usuario/usuario.model';
import { DialogComponent } from '../../shared/dialogs/dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    MatIcon,
    DialogComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponents {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  showPassword = false;
  submitted = false;
  incorretLogin = false;
  errorLogin = false;
  showDialog = false;
  showForgotPasswordDialog = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
  });

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    this.submitted = true;
    this.incorretLogin = false;
    this.errorLogin = false;

    if (this.loginForm.invalid) {
      return;
    }

    const formValue = this.loginForm.value;

    const email = formValue.email!;
    const password = formValue.password!;

    const credentials: UsuarioLogin = {
      email: email,
      senha: password,
    };

    this.authService.login(credentials).subscribe({
      next: (result: OperationResult) => {
        if (result.success) {
          this.router.navigate(['/home']);
          console.log('Login successful:', result.message);
        } else {
          this.incorretLogin = true;
          this.submitted = false;
          console.error('Login failed:', result.message, this.incorretLogin);
        }
      },
      error: (error) => {
        this.errorLogin = true;
        this.submitted = false;
        console.error('Login error:', error, this.errorLogin);
      },
    });
  }

  changeIncorrectFormField() {
    this.incorretLogin = false;
  }

  invalidFieldClass(fieldName: string) {
    const field = this.loginForm.get(fieldName);
    if ((field!.invalid && this.submitted) || this.incorretLogin) {
      return `is-invalid-${fieldName}`;
    } else if (field!.valid && this.submitted) {
      return `is-valid-${fieldName}`;
    } else {
      return '';
    }
  }

  onForgotPasswordClick() {
    this.showForgotPasswordDialog = true;
  }
}
