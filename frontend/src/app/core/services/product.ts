import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { timeout } from 'rxjs';
import { Product, ProductPayload } from '../models/product';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${API_BASE_URL}/products`;

    listProducts() {
        return this.http.get<Product[]>(this.baseUrl).pipe(timeout(10000));
    }

    listManagedProducts() {
        return this.http.get<Product[]>(`${this.baseUrl}/manage`).pipe(timeout(10000));
    }

    createProduct(payload: ProductPayload) {
        return this.http.post<Product>(this.baseUrl, payload);
    }

    updateProduct(id: string, payload: ProductPayload) {
        return this.http.put<Product>(`${this.baseUrl}/${id}`, payload);
    }

    deleteProduct(id: string) {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
    }
}
