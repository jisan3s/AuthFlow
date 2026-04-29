import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { AuthLayout } from '../../layouts/auth-layout/auth-layout';
import { guestGuard } from '../../core/guards/guest-guard';

const routes: Routes = [
    {
        path: '',
        component: AuthLayout,
        canActivate: [guestGuard],
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: Login },
            { path: 'register', component: Register }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }