import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs';
import { User } from '../models/user';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    private baseUrl = `${API_BASE_URL}/admin`;

    constructor(private http: HttpClient) {}

    createAdmin(data: Pick<User, 'name' | 'email' | 'password'>) {
        return this.http.post<User>(`${this.baseUrl}/create-admin`, data);
    }

    getUsers() {
        return this.http.get<User[]>(`${this.baseUrl}/users`).pipe(timeout(10000));
    }

    getAdmins() {
        return this.http.get<User[]>(`${this.baseUrl}/admins`).pipe(timeout(10000));
    }

    toggleAdminBlock(id: string) {
        return this.http.patch<User>(`${this.baseUrl}/admins/${id}/block`, {});
    }

    deleteAdmin(id: string) {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/admins/${id}`);
    }

    toggleUserBlock(id: string) {
        return this.http.patch<User>(`${this.baseUrl}/users/${id}/block`, {});
    }

    deleteUser(id: string) {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/users/${id}`);
    }

}
