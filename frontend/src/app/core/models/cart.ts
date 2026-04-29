import { Product } from './product';

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CartSummary {
    items: CartItem[];
    itemCount: number;
    subtotal: number;
}
