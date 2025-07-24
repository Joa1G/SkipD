import { Routes } from '@angular/router';
import { LoginComponents } from '../components/login/login.components';
import { HomeComponent } from '../components/home/home.component';
import { AddMateriaComponents } from '../components/add-materia/add-materia.components';
import { DetalhesMateriaComponent } from '../components/detalhes-materia/detalhes-materia.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponents
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'add-materia',
    component: AddMateriaComponents
  },
  {
    path: 'detalhes-materia/:id',
    component: DetalhesMateriaComponent
  },
  {
    path: 'edit-materia/:id',
    component: AddMateriaComponents
  }
];
