import { Routes } from '@angular/router';

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
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
