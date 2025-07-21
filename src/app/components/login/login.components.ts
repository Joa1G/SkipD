import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.components.html',
  styleUrl: './login.components.scss'
})
export class LoginComponents {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(){
    if (this.loginForm.valid){
      const { email, password } = this.loginForm.value;
      console.log('Login:', email, password)
      //TODO: chamar serviço de autenticação
    }
  }
}
