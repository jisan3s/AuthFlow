import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    private readonly http = inject(HttpClient);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly baseUrl = `${API_BASE_URL}/auth`;

    private readonly USER_KEY = 'auth_user';
    private readonly TOKEN_KEY = 'auth_token';

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUserSubject.asObservable();

    register(user: User) {
        return this.http.post(`${this.baseUrl}/register`, user);
    }

    login(user: User) {
        return this.http.post<{ user: User; token: string }>(`${this.baseUrl}/login`, user);
    }

    isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    private get storage(): Storage | null {
        return this.isBrowser() ? localStorage : null;
    }

    setSession(data: any) {
        this.storage?.setItem(this.USER_KEY, JSON.stringify(data.user));
        this.storage?.setItem(this.TOKEN_KEY, data.token);

        this.currentUserSubject.next(data.user);
    }

    restoreSession() {
        const user = this.getUser();
        if (user) {
            this.currentUserSubject.next(user);
        }
    }

    getUser(): User | null {
        return JSON.parse(this.storage?.getItem(this.USER_KEY) || 'null');
    }

    getToken(): string | null {
        return this.storage?.getItem(this.TOKEN_KEY) || null;
    }

    getRole(): string | null {
        return this.getUser()?.role || null;
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    logout() {
        this.storage?.removeItem(this.USER_KEY);
        this.storage?.removeItem(this.TOKEN_KEY);
        this.currentUserSubject.next(null);
    }

}
