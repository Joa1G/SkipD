import { Routes } from '@angular/router';
import { LoginComponents } from '../components/login/login.components';
import { HomeComponent } from '../components/home/home.component';
import { AddMateriaComponents } from '../components/add-materia/add-materia.components';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('../components/login/login.components').then((m) => m.LoginComponents)
    },
    {
        path: 'cadastro',
        loadComponent: () => import('../components/cadastro/cadastro.components').then((m) => m.CadastroComponents)
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
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
