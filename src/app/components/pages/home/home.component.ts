import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { InstituicoesListComponents } from './instituicoes-list/instituicoes-list.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home.component',
  imports: [
    HeaderComponent,
    CommonModule,
    MatCardModule,
    MatIcon,
    InstituicoesListComponents,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
