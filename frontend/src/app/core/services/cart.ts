import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem, CartSummary } from '../models/cart';
import { Product } from '../models/product';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly storageKey = 'shop_cart';
    private readonly itemsSignal = signal<CartItem[]>(this.loadCart());

    readonly summary = computed<CartSummary>(() => {
        const items = this.itemsSignal();
        return {
            items,
            itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        };
    });

    add(product: Product, quantity = 1): void {
        const items = [...this.itemsSignal()];
        const existing = items.find(item => item.product._id === product._id);

        if (existing) {
            existing.quantity = Math.min(existing.quantity + quantity, product.stock);
        } else {
            items.push({ product, quantity: Math.min(quantity, product.stock) });
        }

        this.setItems(items);
    }

    updateQuantity(productId: string, quantity: number): void {
        if (quantity < 1) {
            this.remove(productId);
            return;
        }

        const items = this.itemsSignal().map(item => {
            if (item.product._id !== productId) return item;
            return {
                ...item,
                quantity: Math.min(quantity, item.product.stock)
            };
        });

        this.setItems(items);
    }

    remove(productId: string): void {
        this.setItems(this.itemsSignal().filter(item => item.product._id !== productId));
    }

    clear(): void {
        this.setItems([]);
    }

    private setItems(items: CartItem[]): void {
        this.itemsSignal.set(items);
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.storageKey, JSON.stringify(items));
        }
    }

    private loadCart(): CartItem[] {
        if (!isPlatformBrowser(this.platformId)) return [];

        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        } catch {
            return [];
        }
    }
}
