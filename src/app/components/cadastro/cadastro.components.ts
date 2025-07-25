import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

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

  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  cadastroForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
    instituicaoPadrao: new FormControl('', [Validators.required]),
    percentFaltas: new FormControl<number | null>(null, [Validators.required, Validators.min(0), Validators.max(100)])
  }, {validators: passwordMatchValidator});

  adicionarUsuario(){
    
  }

}
