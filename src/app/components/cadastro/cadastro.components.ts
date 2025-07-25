import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AbstractInstituicaoService } from '../../services/instituicao/abstract-instituicao.service';
import { AbstractUsuarioService } from '../../services/usuario/abstract-usuario.service';
import { firstValueFrom } from 'rxjs';
import { Instituicao } from '../../models/instituicao/instituicao.model';

export const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterModule, MatIcon],
  templateUrl: './cadastro.components.html',
  styleUrls: ['./cadastro.components.scss'],
})
export class CadastroComponents {

  private serviceInstituicao = inject(AbstractInstituicaoService);
  private serviceUsuario = inject(AbstractUsuarioService);

  showPassword = false;
  submitted = false;
  showSuccessDialog = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  cadastroForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
    instituicaoPadrao: new FormControl('', [Validators.required]),
    percentFaltas: new FormControl<number>(0, [Validators.required, Validators.min(0), Validators.max(100)])
  }, {validators: passwordMatchValidator});

  async adicionarUsuario(){
    const usuario = {
      nome: this.cadastroForm.value.name!,
      email: this.cadastroForm.value.email!,
      senha: this.cadastroForm.value.password!,
    };

    const result = await firstValueFrom(this.serviceUsuario.addUsuario(usuario));

    if (result.success) {
      console.log('Usuário adicionado com sucesso:', result.data);
      return Number(result.data.id);
    }else {
      console.error('Erro ao adicionar usuário:', result.message);
      return;
    }
  }

  async adicionarInstituicaoPadrao(usuarioId: number) {
    const limite_faltas = this.cadastroForm.value.percentFaltas!;
    const instituicao: Omit<Instituicao, 'id'> = {
      nome: this.cadastroForm.value.instituicaoPadrao!,
      id_usuario: usuarioId,
      percentual_limite_faltas: limite_faltas / 100, // Convertendo para decimal
    };

    const result = await firstValueFrom(this.serviceInstituicao.addInstituicao(instituicao));

    if (result.success) {
      console.log('Instituição adicionada com sucesso:', result.data);
    } else {
      console.error('Erro ao adicionar instituição:', result.message);
      return;
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.cadastroForm.invalid) {
      return;
    }
    try {

      this.adicionarUsuario().then(usuarioId => {
        if (usuarioId) {
          this.adicionarInstituicaoPadrao(usuarioId);
        }
      });

      this.showSuccessDialog = true;
    } catch (error) {
      console.error('Erro ao adicionar usuário ou instituição:', error);
    }
  }
}
