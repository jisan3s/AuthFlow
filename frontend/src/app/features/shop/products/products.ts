import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Product } from '../../../core/models/product';
import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart';
import { ProductService } from '../../../core/services/product';

@Component({
    selector: 'app-shop-products',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './products.html',
    styleUrl: './products.scss'
})
export class ShopProducts {
    private readonly productService = inject(ProductService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly auth = inject(AuthService);
    readonly cart = inject(CartService);

    products: Product[] = [];
    loading = false;
    error = '';
    addedId = '';
    readonly cartSummary = computed(() => this.cart.summary());

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.loading = true;
        this.productService.listProducts().pipe(
            finalize(() => {
                this.loading = false;
                this.cdr.detectChanges();
            })
        ).subscribe({
            next: (products) => {
                this.products = products;
            },
            error: (err) => {
                this.error = err.error?.message || 'Failed to load products';
            }
        });
    }

    addToCart(product: Product): void {
        if (!this.canPurchase()) {
            return;
        }

        this.cart.add(product);
        this.addedId = product._id;
        window.setTimeout(() => this.addedId = '', 1200);
        this.cdr.detectChanges();
    }

    currentUser() {
        return this.auth.getUser();
    }

    dashboardLink(): string {
        const role = this.auth.getRole();
        if (role === 'MAIN_ADMIN') return '/admin/dashboard';
        if (role === 'ADMIN') return '/panel/dashboard';
        if (role === 'USER') return '/user/dashboard';
        return '/auth/login';
    }

    dashboardLabel(): string {
        const role = this.auth.getRole();
        if (role === 'MAIN_ADMIN') return 'Main Admin Dashboard';
        if (role === 'ADMIN') return 'Admin Dashboard';
        if (role === 'USER') return 'User Dashboard';
        return 'Login';
    }

    canPurchase(): boolean {
        return this.auth.getRole() === 'USER' || !this.auth.isLoggedIn();
    }
}
