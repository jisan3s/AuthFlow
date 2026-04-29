import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { Router, RouterLink } from '@angular/router';
import { ActivityService } from '../../../core/services/activity';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './login.html',
    styleUrl: './login.scss',
})
export class Login {

    private readonly fb = inject(FormBuilder);
    private readonly auth = inject(AuthService);
    private readonly activityService = inject(ActivityService);
    private readonly router = inject(Router);

    loading = false;
    errorMessage = '';

    readonly form = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
    });

    onSubmit() {
        if (this.form.invalid) return;

        this.loading = true;
        const { email, password } = this.form.getRawValue();

        this.auth.login({ email, password }).subscribe({
            next: (res: any) => {
                this.auth.setSession(res);

                const role = res.user.role;

                const routeMap: any = {
                    MAIN_ADMIN: '/admin/dashboard',
                    ADMIN: '/panel/dashboard',
                    USER: '/user/dashboard'
                };

                this.router.navigate([routeMap[role] || '/auth/login']);

                this.activityService.log('LOGIN', {
                    email: res.user.email,
                    role: res.user.role
                }).subscribe();
            },
            error: (err: HttpErrorResponse) => {
                this.errorMessage = err.error?.message || 'Login failed';
                this.loading = false;
            }
        });
    }

}