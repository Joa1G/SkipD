import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  AsyncValidatorFn,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AbstractInstituicaoService } from '../../../services/instituicao/abstract-instituicao.service';
import { AbstractUsuarioService } from '../../../services/usuario/abstract-usuario.service';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { Instituicao } from '../../../models/instituicao/instituicao.model';
import { DialogComponent } from '../../shared/dialogs/dialog.component';

export const passwordMatchValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
};

export const emailInUseValidator = (
  usuarioService: AbstractUsuarioService
): AsyncValidatorFn => {
  return (control: AbstractControl) => {
    if (!control.value) {
      return of(null);
    }

    return usuarioService.isEmailInUse(control.value).pipe(
      map((result) => {
        if (result.success && result.data) {
          return { emailInUse: true };
        }
        return null;
      }),
      catchError(() => of(null))
    );
  };
};

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIcon,
    DialogComponent,
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponents {
  private serviceInstituicao = inject(AbstractInstituicaoService);
  private serviceUsuario = inject(AbstractUsuarioService);

  showPassword = false;
  submitted = false;
  showSuccessDialog = false;
  incorretFormField = false;
  errorForm = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  cadastroForm = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      instituicaoPadrao: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      percentFaltas: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
    },
    { validators: passwordMatchValidator }
  );

  async adicionarUsuario() {
    const usuario = {
      nome: this.cadastroForm.value.name!,
      email: this.cadastroForm.value.email!,
      senha: this.cadastroForm.value.password!,
    };

    try {
      const result = await firstValueFrom(
        this.serviceUsuario.addUsuario(usuario)
      );

      if (result.success && result.data) {
        console.log('Usuário adicionado com sucesso:', result.data);
        const userId = Number(result.data.id);
        console.log('ID do usuário:', userId);
        return userId;
      } else {
        console.error('Erro ao adicionar usuário:', result.message);
        throw new Error(`Falha ao criar usuário: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro na requisição de criação do usuário:', error);
      throw error;
    }
  }

  async adicionarInstituicaoPadrao(usuarioId: number) {
    console.log('Adicionando instituição para usuário ID:', usuarioId);

    if (!usuarioId || usuarioId <= 0) {
      throw new Error('ID do usuário inválido para criação da instituição');
    }

    const limite_faltas = Number(this.cadastroForm.value.percentFaltas!);
    const instituicao: Omit<Instituicao, 'id'> = {
      nome: this.cadastroForm.value.instituicaoPadrao!,
      id_usuario: usuarioId,
      percentual_limite_faltas: limite_faltas / 100, // Convertendo para decimal
    };

    console.log('Dados da instituição a ser criada:', instituicao);

    try {
      const result = await firstValueFrom(
        this.serviceInstituicao.addInstituicao(instituicao)
      );

      if (result.success) {
        console.log('Instituição adicionada com sucesso:', result.data);
        return result.data;
      } else {
        console.error('Erro ao adicionar instituição:', result.message);
        throw new Error(`Falha ao criar instituição: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro na requisição de criação da instituição:', error);
      throw error;
    }
  }

  async checkEmailInUse(email: string): Promise<boolean> {
    try {
      const result = await firstValueFrom(
        this.serviceUsuario.isEmailInUse(email)
      );
      return result.success && result.data;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      return false;
    }
  }

  async onSubmit() {
    this.submitted = true;

    // Primeira validação - campos básicos
    if (this.cadastroForm.invalid) {
      this.incorretFormField = true;
      this.submitted = false;
      return;
    }

    // Segunda validação - verificar se email já está em uso
    const emailInUse = await this.checkEmailInUse(
      this.cadastroForm.value.email!
    );
    if (emailInUse) {
      // Adiciona erro personalizado ao campo email
      this.cadastroForm.get('email')?.setErrors({ emailInUse: true });
      this.incorretFormField = true;
      this.submitted = false;
      return;
    }

    try {
      const usuarioId = await this.adicionarUsuario();
      if (usuarioId) {
        await this.adicionarInstituicaoPadrao(usuarioId);
        this.showSuccessDialog = true;
      } else {
        this.errorForm = true;
        this.submitted = false;
        console.error('Erro: ID do usuário não foi retornado');
      }
    } catch (error) {
      this.errorForm = true;
      this.submitted = false;
      console.error('Erro ao adicionar usuário ou instituição:', error);
    }
  }

  invalidFieldClass(fieldName: string) {
    const field = this.cadastroForm.get(fieldName);

    if (
      fieldName === 'confirmPassword' &&
      this.cadastroForm.hasError('passwordMismatch') &&
      (field!.dirty || this.submitted)
    ) {
      return 'is-invalid';
    }
    if (field!.valid && (field!.dirty || this.submitted)) {
      return 'is-valid';
    } else if (
      (field!.invalid && (field!.dirty || this.submitted)) ||
      this.incorretFormField
    ) {
      return 'is-invalid';
    } else {
      return '';
    }
  }

  invalidFieldClassEmail() {
    const field = this.cadastroForm.get('email');

    if (field!.hasError('required') && field!.dirty) {
      return 'is-invalid';
    } else if (field!.hasError('email') && field!.dirty) {
      return 'is-invalid';
    } else if (field!.hasError('emailInUse')) {
      return 'is-invalid';
    } else if (field!.valid && field!.dirty) {
      return 'is-valid';
    } else {
      return '';
    }
  }

  changeIncorrectFormField() {
    if (this.cadastroForm.valid) {
      this.incorretFormField = false;
    }
    // Limpa o erro de email em uso quando o usuário digita
    const emailControl = this.cadastroForm.get('email');
    if (emailControl?.hasError('emailInUse')) {
      emailControl.setErrors(null);
    }
  }
}
