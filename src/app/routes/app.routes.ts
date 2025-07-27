import { Routes } from '@angular/router';
import { LoginComponents } from '../components/login/login.component';
import { CadastroComponents } from '../components/cadastro/cadastro.component';
import { HomeComponent } from '../components/home/home.component';
import { AddMateriaComponents } from '../components/add-materia/add-materia.component';
import { DetalhesMateriaComponent } from '../components/detalhes-materia/detalhes-materia.component';
import { authGuard, guestGuard } from '../guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponents,
    canActivate: [guestGuard]
  },
  {
    path: 'cadastro',
    component: CadastroComponents,
    canActivate: [guestGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'add-materia',
    component: AddMateriaComponents,
    canActivate: [authGuard]
  },
  {
    path: 'detalhes-materia/:id',
    component: DetalhesMateriaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'edit-materia/:id',
    component: AddMateriaComponents,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
