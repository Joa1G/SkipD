import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MockedUsuarioService } from '../../services/usuario/mocked-usuario.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './cadastro.components.html',
  styleUrls: ['./cadastro.components.scss'],
  providers: [MockedUsuarioService]
})
export class CadastroComponents {
  cadastroForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: MockedUsuarioService
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      instituicao_padrao: ['', [Validators.required]],
      percent_faltas: [null, [Validators.required, Validators.max(30)]],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator() });
  }

  passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirm_password')?.value;
      return password === confirmPassword ? null : { passwordsMismatch: true };
    };
  }

  isInvalid(field: string): boolean {
    const control = this.cadastroForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      const { nome, email, instituicao_padrao, percent_faltas, password } = this.cadastroForm.value;

      this.usuarioService.cadastrar({
        nome,
        email,
        senha: password
      }).subscribe(result => {
        if (result.success) {
          console.log('Usuário cadastrado com sucesso:', result.data);
          this.router.navigate(['/login']); // ✅ redireciona corretamente
        } else {
          this.errorMessage = result.message || 'Erro ao cadastrar usuário.';
        }
      });
    } else {
      console.log('Formulário inválido');
      this.cadastroForm.markAllAsTouched();
    }
  }
}
