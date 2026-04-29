import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart';
import { OrderService } from '../../../core/services/order';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './checkout.html',
    styleUrl: './checkout.scss'
})
export class Checkout {
    private readonly orderService = inject(OrderService);
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);
    private readonly platformId = inject(PLATFORM_ID);
    readonly cart = inject(CartService);
    readonly summary = computed(() => this.cart.summary());

    loading = false;
    error = '';

    ngOnInit(): void {
        if (this.isAdminRole()) {
            this.cart.clear();
            this.router.navigate([this.dashboardLink()]);
        }
    }

    startCheckout(): void {
        if (!this.auth.isLoggedIn()) {
            this.router.navigate(['/auth/login']);
            return;
        }

        if (this.isAdminRole()) {
            this.error = 'Admin accounts cannot purchase products.';
            this.cart.clear();
            this.router.navigate([this.dashboardLink()]);
            return;
        }

        if (!this.summary().items.length) {
            this.router.navigate(['/cart']);
            return;
        }

        this.loading = true;
        this.error = '';

        this.orderService.createCheckoutSession(this.summary().items).subscribe({
            next: (res) => {
                if (isPlatformBrowser(this.platformId)) {
                    window.location.href = res.checkoutUrl;
                }
            },
            error: (err) => {
                this.error = err.error?.message || 'Checkout could not be started';
                this.loading = false;
            }
        });
    }

    isAdminRole(): boolean {
        const role = this.auth.getRole();
        return role === 'MAIN_ADMIN' || role === 'ADMIN';
    }

    dashboardLink(): string {
        const role = this.auth.getRole();
        if (role === 'MAIN_ADMIN') return '/admin/dashboard';
        if (role === 'ADMIN') return '/panel/dashboard';
        return '/products';
    }
}
