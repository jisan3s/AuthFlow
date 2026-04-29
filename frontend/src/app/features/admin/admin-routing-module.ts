import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Users } from './users/users';
import { AdminManagement } from './admin-management/admin-management';
import { Settings } from './settings/settings';
import { Products } from './products/products';
import { AdminLayout } from '../../layouts/admin-layout/admin-layout';
import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';

const routes: Routes = [
    {
        path: '',
        component: AdminLayout,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['MAIN_ADMIN'] },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard },
            { path: 'users', component: Users },
            { path: 'admin-management', component: AdminManagement },
            { path: 'products', component: Products },
            { path: 'settings', component: Settings }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
