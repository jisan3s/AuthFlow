import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface ActivityItem {
    _id: string;
    action: string;
    meta?: Record<string, unknown>;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class ActivityService {

    private baseUrl = `${API_BASE_URL}/activity`;

    constructor(private http: HttpClient) {}

    log(action: string, meta?: any) {
        return this.http.post<ActivityItem>(`${this.baseUrl}/log`, {
            action,
            meta
        });
    }

    getMyActivities(): Observable<ActivityItem[]> {
        return this.http.get<ActivityItem[]>(`${this.baseUrl}/me`);
    }

    getAllActivities(): Observable<ActivityItem[]> {
        return this.http.get<ActivityItem[]>(`${this.baseUrl}/all`);
    }

}
