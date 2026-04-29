import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivityItem, ActivityService } from '../../../core/services/activity';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-activity',
    imports: [CommonModule],
    templateUrl: './activity.html',
    styleUrl: './activity.scss',
})
export class Activity {
    private readonly activityService = inject(ActivityService);
    private readonly cdr = inject(ChangeDetectorRef);

    activities: ActivityItem[] = [];
    loading = false;
    error = '';

    ngOnInit(): void {
        this.loadActivities();
    }

    loadActivities(): void {
        this.loading = true;
        this.activityService.getMyActivities().pipe(
            finalize(() => {
                this.loading = false;
                this.cdr.detectChanges();
            })
        ).subscribe({
            next: (res) => {
                this.activities = res;
            },
            error: (err: HttpErrorResponse) => {
                this.error = err.error?.message || 'Failed to load activity';
            }
        });
    }

    formatMeta(meta?: Record<string, unknown>): string {
        if (!meta) {
            return '';
        }

        return Object.entries(meta)
            .map(([key, value]) => `${key}: ${String(value)}`)
            .join(' | ');
    }

}
