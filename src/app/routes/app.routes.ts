import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('../login/login.components').then((m) => m.LoginComponents)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
