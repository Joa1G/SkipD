import { Routes } from '@angular/router';
import { LoginComponents } from '../components/pages/login/login.component';
import { CadastroComponents } from '../components/pages/cadastro/cadastro.component';
import { HomeComponent } from '../components/pages/home/home.component';
import { AddMateriaComponents } from '../components/pages/add-materia/add-materia.component';
import { DetalhesMateriaComponent } from '../components/pages/detalhes-materia/detalhes-materia.component';
import { authGuard, guestGuard } from '../guards/auth.guard';
import { materiaGuard } from '../guards/materia.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponents,
    canActivate: [guestGuard],
  },
  {
    path: 'cadastro',
    component: CadastroComponents,
    canActivate: [guestGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'add-materia/:id',
    component: AddMateriaComponents,
    canActivate: [authGuard],
  },
  {
    path: 'detalhes-materia/:id',
    component: DetalhesMateriaComponent,
    canActivate: [authGuard, materiaGuard],
  },
  {
    path: 'edit-materia/:id',
    component: AddMateriaComponents,
    canActivate: [authGuard, materiaGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
