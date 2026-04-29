import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
        import('./features/home/home').then(m => m.Home)
    },

    {
        path: 'products',
        loadComponent: () =>
        import('./features/shop/products/products').then(m => m.ShopProducts)
    },

    {
        path: 'cart',
        loadComponent: () =>
        import('./features/shop/cart/cart').then(m => m.Cart)
    },

    {
        path: 'checkout',
        loadComponent: () =>
        import('./features/shop/checkout/checkout').then(m => m.Checkout)
    },

    {
        path: 'checkout/success',
        loadComponent: () =>
        import('./features/shop/checkout-success/checkout-success').then(m => m.CheckoutSuccess)
    },

    {
        path: 'checkout/cancel',
        loadComponent: () =>
        import('./features/shop/checkout-cancel/checkout-cancel').then(m => m.CheckoutCancel)
    },

    {
        path: 'auth',
        loadChildren: () =>
        import('./features/auth/auth-module').then(m => m.AuthModule)
    },

    {
        path: 'admin',
        loadChildren: () =>
        import('./features/admin/admin-module').then(m => m.AdminModule)
    },

    {
        path: 'panel',
        loadChildren: () =>
        import('./features/panel/panel-module').then(m => m.PanelModule)
    },

    {
        path: 'user',
        loadChildren: () =>
        import('./features/user/user-module').then(m => m.UserModule)
    },

    {
        path: '**',
        redirectTo: ''
    }
];
