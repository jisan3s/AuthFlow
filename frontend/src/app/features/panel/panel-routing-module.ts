import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Activity } from './activity/activity';
import { Products } from '../admin/products/products';
import { PanelLayout } from '../../layouts/panel-layout/panel-layout';
import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';

const routes: Routes = [
    {
        path: '',
        component: PanelLayout,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard },
            { path: 'products', component: Products },
            { path: 'activity', component: Activity }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PanelRoutingModule { }
