import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

export const LOGIN_ENDPOINT = environment.auth.login.endpoint;
export const TOKEN_KEY = environment.auth.tokenKey;
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
        localStorage.removeItem(TOKEN_KEY);
    }

    public storeToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    }

    public removeToken(): void {
        localStorage.removeItem(TOKEN_KEY);
    }

    public getToken(): string {
        return localStorage.getItem(TOKEN_KEY);
    }
}

export interface User {
    realm: string;
    username: string;
    password: string;
    email: string;

    [key: string]: any;
}
