import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './cadastro.components.html',
  styleUrl: './cadastro.components.scss'
})
export class CadastroComponents {
  cadastroForm: FormGroup;

  constructor(private fb: FormBuilder){
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],//TODO: precisa de validação?
      email: ['', [Validators.required, Validators.email]],
      instituicao_padrao: ['', [Validators.required]],
      percent_faltas: [null, [Validators.required, Validators.max(30)]],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    });
  }

  passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirm_password')?.value;
      return password === confirmPassword ? null : { passwordsMismatch: true };
    };
  }

  onSubmit(){
    if (this.cadastroForm.valid){
      const { nome, email, instituicao_padrao, percent_faltas, password, confirm_password } = this.cadastroForm.value;
      console.log('Cadastro:', nome, email, instituicao_padrao, percent_faltas, password, confirm_password)
    }
  }
}
