import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivityItem, ActivityService } from '../../../core/services/activity';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-activity',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './activity.html',
    styleUrl: './activity.scss',
})
export class Activity {
    private readonly activityService = inject(ActivityService);
    private readonly cdr = inject(ChangeDetectorRef);

    activities: ActivityItem[] = [];
    loading = false;

    ngOnInit(): void {
        this.loadActivities();
    }

    loadActivities(): void {
        this.loading = true;
        this.activityService.getAllActivities().pipe(
            finalize(() => {
                this.loading = false;
                this.cdr.detectChanges();
            })
        ).subscribe({
            next: (activities) => {
                this.activities = activities;
            },
            error: () => {}
        });
    }
}
