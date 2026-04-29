import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AdminService } from '../../../core/services/admin';
import { User } from '../../../core/models/user';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-users',
    imports: [],
    templateUrl: './users.html',
    styleUrl: './users.scss',
})
export class Users {

    private readonly adminService = inject(AdminService);
    private readonly cdr = inject(ChangeDetectorRef);

    users: User[] = [];
    loading = false;
    error = '';

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers() {
        this.loading = true;
        this.adminService.getUsers().pipe(
            finalize(() => {
                this.loading = false;
                this.cdr.detectChanges();
            })
        ).subscribe({
            next: (res) => {
                this.users = res;
            },
            error: (err: HttpErrorResponse) => {
                this.error = err.error?.message || 'Failed to load users';
            }
        });
    }

    toggleBlock(user: User) {
        const userId = user._id || user.id;
        if (!userId) return;

        this.adminService.toggleUserBlock(userId).subscribe({
            next: (updatedUser) => {
                this.users = this.users.map((item) =>
                    (item._id || item.id) === userId ? updatedUser : item
                );
                this.cdr.detectChanges();
            },
            error: (err: HttpErrorResponse) => {
                this.error = err.error?.message || 'Failed to update user status';
            }
        });
    }

    deleteUser(user: User) {
        const userId = user._id || user.id;
        if (!userId) return;

        this.adminService.deleteUser(userId).subscribe({
            next: () => {
                this.users = this.users.filter((item) => (item._id || item.id) !== userId);
                this.cdr.detectChanges();
            },
            error: (err: HttpErrorResponse) => {
                this.error = err.error?.message || 'Failed to delete user';
            }
        });
    }

}
