import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isBrowser()) {
        return true;
    }

    if (auth.isLoggedIn()) {
        return true;
    }

    return router.createUrlTree(['/auth/login']);

};