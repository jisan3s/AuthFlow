import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-checkout-cancel',
    standalone: true,
    imports: [RouterLink],
    template: `
        <main class="container py-5 text-center">
            <h1>Checkout Cancelled</h1>
            <p class="text-muted">Your cart is still saved so you can review it again.</p>
            <a class="btn btn-dark" routerLink="/cart">Return to cart</a>
        </main>
    `
})
export class CheckoutCancel { }
