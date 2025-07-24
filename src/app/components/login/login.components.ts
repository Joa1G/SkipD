import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MockedUsuarioService } from '../services/usuario/mocked-usuario.service'; 
import { OperationResult } from '../models/operation-result.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.components.html',
  styleUrl: './login.components.scss',
  providers: [MockedUsuarioService]
})
export class LoginComponents {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: MockedUsuarioService,
    private router: Router 
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.usuarioService.login(email, password).subscribe((result: OperationResult) => {
        if (result.success) {
          console.log('Usuário logado com sucesso:', result.data);
          this.router.navigate(['/home']); 
        } else {
          this.errorMessage = result.message || 'Erro ao fazer login';
        }
      });
    } else {
      this.errorMessage = 'Preencha todos os campos corretamente';
    }
  }
}
