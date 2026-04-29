import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './cart.html',
    styleUrl: './cart.scss'
})
export class Cart {
    readonly cart = inject(CartService);
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);
    readonly summary = computed(() => this.cart.summary());

    ngOnInit(): void {
        if (this.isAdminRole()) {
            this.cart.clear();
        }
    }

    updateQuantity(productId: string, value: string): void {
        if (this.isAdminRole()) return;
        this.cart.updateQuantity(productId, Number(value));
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

    goToCheckout(): void {
        if (this.isAdminRole()) {
            this.router.navigate([this.dashboardLink()]);
            return;
        }

        this.router.navigate(['/checkout']);
    }
}
