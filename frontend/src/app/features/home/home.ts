import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Product } from '../../core/models/product';
import { AuthService } from '../../core/services/auth';
import { CartService } from '../../core/services/cart';
import { ProductService } from '../../core/services/product';

interface Testimonial {
    quote: string;
    name: string;
    role: string;
}

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './home.html',
    styleUrl: './home.scss',
})
export class Home {
    private readonly productService = inject(ProductService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly auth = inject(AuthService);
    readonly cart = inject(CartService);
    readonly cartSummary = computed(() => this.cart.summary());

    products: Product[] = [];
    loading = false;
    error = '';
    addedId = '';

    readonly testimonials: Testimonial[] = [
        {
            quote: 'The storefront feels premium, fast, and simple to browse. Checkout starts from a place of trust.',
            name: 'Maya Thompson',
            role: 'Retail Founder',
        },
        {
            quote: 'Our launch page finally matches the quality of our catalog and makes product discovery effortless.',
            name: 'Daniel Park',
            role: 'Brand Director',
        },
        {
            quote: 'Clean navigation, sharp product cards, and clear account access made the experience feel complete.',
            name: 'Ari Williams',
            role: 'Customer Experience Lead',
        },
    ];

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
                this.products = products.slice(0, 6);
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
