import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CartItem } from '../models/cart';
import { API_BASE_URL } from '../config/api.config';

interface CheckoutResponse {
    orderId: string;
    sessionId: string;
    checkoutUrl: string;
    totalAmount: number;
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${API_BASE_URL}/orders`;

    createCheckoutSession(items: CartItem[]) {
        return this.http.post<CheckoutResponse>(`${this.baseUrl}/checkout-session`, {
            items: items.map(item => ({
                productId: item.product._id,
                quantity: item.quantity
            }))
        });
    }
}
