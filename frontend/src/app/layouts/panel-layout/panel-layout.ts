import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
    selector: 'app-panel-layout',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
    templateUrl: './panel-layout.html',
    styleUrl: './panel-layout.scss',
})
export class PanelLayout {
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
