import { HttpErrorResponse } from '@angular/common/http';
import { DashboardService } from '../../../core/services/dashboard';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { DashboardStats } from '../../../core/services/dashboard';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss',
})
export class Dashboard {
    private readonly dashboardService = inject(DashboardService);
    private readonly cdr = inject(ChangeDetectorRef);

    stats: DashboardStats | null = null;
    loading = false;
    error = '';

    ngOnInit(): void {
        this.loadStats();
    }

    loadStats(): void {
        this.loading = true;
        this.dashboardService.getStats().pipe(
            finalize(() => {
                this.loading = false;
                this.cdr.detectChanges();
            })
        ).subscribe({
            next: (res) => {
                this.stats = res;
            },
            error: (err: HttpErrorResponse) => {
                this.error = err.error?.message || 'Failed to load dashboard';
            }
        });
    }

}
