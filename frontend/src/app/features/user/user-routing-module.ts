import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Activity } from './activity/activity';
import { Profile } from './profile/profile';
import { UserLayout } from '../../layouts/user-layout/user-layout';
import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';

const routes: Routes = [
    {
        path: '',
        component: UserLayout,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['USER'] },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard },
            { path: 'activity', component: Activity },
            { path: 'profile', component: Profile }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
