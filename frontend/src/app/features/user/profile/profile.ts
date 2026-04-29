import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './profile.html',
    styleUrl: './profile.scss',
})
export class Profile {
    private readonly auth = inject(AuthService);

    currentUser() {
        return this.auth.getUser();
    }
}
