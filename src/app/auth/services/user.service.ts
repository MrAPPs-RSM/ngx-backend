import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

export const LOGIN_ENDPOINT = environment.auth.login.endpoint;
export const ACCESS_TOKEN_KEY = environment.auth.tokenKey;
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_KEY = 'user';

@Injectable()
export class UserService {

    constructor() {

    }

    public storeUser(user: User): void {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    public getUser(): User {
        return JSON.parse(localStorage.getItem(USER_KEY));
    }

    public removeUser(): void {
        localStorage.removeItem(USER_KEY);
    }

    public storeToken(token: string): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }

    public removeToken(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    }

    public getToken(): string {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    }

    public storeRefreshToken(refreshToken: string): void {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    public removeRefreshToken(): void {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }

    public getRefreshToken(): string {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }

    public cleanupData(): void {
        this.removeUser();
        this.removeRefreshToken();
        this.removeToken();
    }
}

export interface User {
    realm: string;
    username: string;
    password: string;
    email: string;

    [key: string]: any;
}
