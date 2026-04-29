import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = () => {

    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isBrowser()) {
        return true;
    }

    if (auth.isLoggedIn()) {
        const role = auth.getRole();

        if (role === 'MAIN_ADMIN') {
            return router.createUrlTree(['/admin/dashboard']);
        }

        if (role === 'ADMIN') {
            return router.createUrlTree(['/panel/dashboard']);
        }

        return router.createUrlTree(['/user/dashboard']);
    }

    return true;

};