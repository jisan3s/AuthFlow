import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivityItem, ActivityService } from '../../../core/services/activity';
import { AuthService } from '../../../core/services/auth';
import { finalize } from 'rxjs';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.scss',
})
export class Dashboard {
	private readonly activityService = inject(ActivityService);
	private readonly auth = inject(AuthService);
	private readonly cdr = inject(ChangeDetectorRef);

	recentActivities: ActivityItem[] = [];
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
				this.recentActivities = activities.slice(0, 6);
			},
			error: () => {}
		});
	}

	get currentUser() {
		return this.auth.getUser();
	}
}
