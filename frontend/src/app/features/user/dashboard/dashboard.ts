import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ActivityItem, ActivityService } from '../../../core/services/activity';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss',
})
export class Dashboard {
    private readonly auth = inject(AuthService);
    private readonly activityService = inject(ActivityService);
    private readonly cdr = inject(ChangeDetectorRef);

    recentActivities: ActivityItem[] = [];
    loading = false;
    error = '';

    ngOnInit(): void {
        this.loadActivities();
    }

    currentUser() {
        return this.auth.getUser();
    }

    loadActivities(): void {
        this.loading = true;
        this.activityService.getMyActivities().pipe(
            finalize(() => {
                this.loading = false;
                this.cdr.detectChanges();
            })
        ).subscribe({
            next: (activities) => {
                this.recentActivities = activities.slice(0, 5);
            },
            error: (err) => {
                this.error = err.error?.message || 'Failed to load activity';
            }
        });
    }
}
