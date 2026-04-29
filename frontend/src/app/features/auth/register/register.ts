import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './register.html',
    styleUrl: './register.scss',
})
export class Register {
    private readonly fb = inject(FormBuilder);
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    loading = false;
    error = '';
    success = '';

    readonly form = this.fb.nonNullable.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    onSubmit() {
        if (this.form.invalid) return;

        this.loading = true;
        const { name, email, password } = this.form.getRawValue();

        this.auth.register({ name, email, password }).subscribe({
            next: () => {
                this.success = 'Registration successful! Please login.';
                this.error = '';
                this.loading = false;
                this.form.reset();

                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 1000);
            },
            error: (err: HttpErrorResponse) => {
                this.error = err.error?.message || 'Registration failed';
                this.success = '';
                this.loading = false;
            }
        });
    }

}
