import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart';

@Component({
    selector: 'app-checkout-success',
    standalone: true,
    imports: [RouterLink],
    template: `
        <main class="container py-5 text-center">
            <h1>Checkout Complete</h1>
            <p class="text-muted">Your payment flow finished successfully.</p>
            <a class="btn btn-dark" routerLink="/products">Back to shop</a>
        </main>
    `
})
export class CheckoutSuccess {
    private readonly cart = inject(CartService);

    ngOnInit(): void {
        this.cart.clear();
    }
}
