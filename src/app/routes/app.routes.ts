import { Routes } from '@angular/router';
import { LoginComponents } from '../components/login/login.components';
import { HomeComponent } from '../components/home/home.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponents
    },
    {
        path: '',
        component: HomeComponent
    },
];
