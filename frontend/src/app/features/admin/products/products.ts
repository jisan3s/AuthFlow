import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Product, ProductPayload } from '../../../core/models/product';
import { ProductService } from '../../../core/services/product';

const emptyForm = (): ProductPayload => ({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    stock: 0,
    category: 'General',
    isActive: true
});

@Component({
    selector: 'app-products-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './products.html',
    styleUrl: './products.scss'
})
export class Products {
    private readonly productService = inject(ProductService);
    private readonly cdr = inject(ChangeDetectorRef);

    products: Product[] = [];
    form: ProductPayload = emptyForm();
    editingId = '';
    loading = false;
    saving = false;
    error = '';
    success = '';

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.loading = true;
        this.productService.listManagedProducts().pipe(
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

    saveProduct(): void {
        this.saving = true;
        this.error = '';
        this.success = '';

        const request = this.editingId
            ? this.productService.updateProduct(this.editingId, this.form)
            : this.productService.createProduct(this.form);

        request.subscribe({
            next: () => {
                this.success = this.editingId ? 'Product updated' : 'Product created';
                this.resetForm();
                this.loadProducts();
                this.saving = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.error = err.error?.message || 'Failed to save product';
                this.saving = false;
                this.cdr.detectChanges();
            }
        });
    }

    editProduct(product: Product): void {
        this.editingId = product._id;
        this.form = {
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            stock: product.stock,
            category: product.category,
            isActive: product.isActive
        };
    }

    deleteProduct(product: Product): void {
        this.productService.deleteProduct(product._id).subscribe({
            next: () => {
                this.success = 'Product deleted';
                this.loadProducts();
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.error = err.error?.message || 'Failed to delete product';
            }
        });
    }

    resetForm(): void {
        this.editingId = '';
        this.form = emptyForm();
    }
}
