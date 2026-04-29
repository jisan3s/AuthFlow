import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AdminService } from '../../../core/services/admin';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../core/models/user';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-admin-management',
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './admin-management.html',
    styleUrl: './admin-management.scss',
})
export class AdminManagement {

    private readonly fb = inject(FormBuilder);
    private readonly adminService = inject(AdminService);
    private readonly cdr = inject(ChangeDetectorRef);

    admins: User[] = [];
    loading = false;
    success = '';
    error = '';

    readonly form = this.fb.nonNullable.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
    });

    ngOnInit(): void {
        this.loadAdmins();
    }

    loadAdmins() {
        this.loading = true;
        this.adminService.getAdmins().pipe(
            finalize(() => {
                this.loading = false;
                this.cdr.detectChanges();
            })
        ).subscribe({
            next: (admins) => {
                this.admins = admins;
            },
            error: (err: HttpErrorResponse) => {
                this.error = err.error?.message || 'Failed to load admins';
            }
        });
    }

    onSubmit() {
        if (this.form.invalid) return;

        const { name, email, password } = this.form.getRawValue();

        this.adminService.createAdmin({ name, email, password }).subscribe({
            next: () => {
                this.success = 'Admin created successfully';
                this.error = '';
                this.form.reset();
                this.loadAdmins();
                this.cdr.detectChanges();
            },
            error: (err: HttpErrorResponse) => {
                this.error = err.error?.message || 'Failed to create admin';
                this.success = '';
            }
        });
    }

    toggleBlock(admin: User) {
        const adminId = admin._id || admin.id;
        if (!adminId || admin.role === 'MAIN_ADMIN') return;

        this.adminService.toggleAdminBlock(adminId).subscribe({
            next: (updatedAdmin) => {
                this.admins = this.admins.map((item) =>
                    (item._id || item.id) === adminId ? updatedAdmin : item
                );
                this.cdr.detectChanges();
            },
            error: (err: HttpErrorResponse) => {
                this.error = err.error?.message || 'Failed to update admin status';
                this.success = '';
            }
        });
    }

    deleteAdmin(admin: User) {
        const adminId = admin._id || admin.id;
        if (!adminId || admin.role === 'MAIN_ADMIN') return;

        this.adminService.deleteAdmin(adminId).subscribe({
            next: (res) => {
                this.admins = this.admins.filter((item) => (item._id || item.id) !== adminId);
                this.success = res.message;
                this.error = '';
                this.cdr.detectChanges();
            },
            error: (err: HttpErrorResponse) => {
                this.error = err.error?.message || 'Failed to delete admin';
                this.success = '';
            }
        });
    }

}
