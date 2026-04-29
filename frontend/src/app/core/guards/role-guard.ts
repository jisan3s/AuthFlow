import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {

    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isBrowser()) {
        return true;
    }

    const allowedRoles = route.data['roles'] as string[];
    const userRole = auth.getRole();

    if (!userRole) {
        return router.createUrlTree(['/auth/login']);
    }

    if (allowedRoles.includes(userRole)) {
        return true;
    }

    // Smart fallback redirect
    if (userRole === 'MAIN_ADMIN') {
        return router.createUrlTree(['/admin/dashboard']);
    }

    if (userRole === 'ADMIN') {
        return router.createUrlTree(['/panel/dashboard']);
    }

    return router.createUrlTree(['/user/dashboard']);

};