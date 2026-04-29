export interface User {
    _id?: string;
    id?: string;
    name?: string;
    email: string;
    password?: string;
    role?: 'MAIN_ADMIN' | 'ADMIN' | 'USER';
    token?: string;
    isBlocked?: boolean;
}