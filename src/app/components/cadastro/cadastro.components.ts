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

}
