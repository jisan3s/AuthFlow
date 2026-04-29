import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './settings.html',
    styleUrl: './settings.scss',
})
export class Settings {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    currentUser() {
        return this.auth.getUser();
    }

    logout() {
        this.auth.logout();
        this.router.navigate(['/auth/login']);
    }
}
