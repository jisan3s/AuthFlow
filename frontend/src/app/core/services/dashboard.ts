import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface DashboardActivity {
    _id: string;
    action: string;
    createdAt: string;
    userId?: {
        _id?: string;
        name?: string;
        email?: string;
        role?: string;
    };
}

export interface DashboardStats {
    totalUsers: number;
    totalAdmins: number;
    totalMainAdmins: number;
    totalAllUsers: number;
    totalProducts: number;
    activeProducts: number;
    totalActivities: number;
    recentActivities: DashboardActivity[];
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private baseUrl = `${API_BASE_URL}/dashboard`;

    constructor(private http: HttpClient) {}

    getStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.baseUrl}/stats`).pipe(timeout(10000));
    }

}
