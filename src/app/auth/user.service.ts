import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable()
export class UserService {

    constructor() {
    }

    public userKey = 'user';
    public tokenKey = environment.auth.tokenKey;

    public storeUser(user: any): void {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    public getUser(): any {
        return JSON.parse(localStorage.getItem(this.userKey));
    }

    public removeUser(): void {
        localStorage.removeItem(this.tokenKey);
    }

    public storeToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    public removeToken(): void {
        localStorage.removeItem(this.tokenKey);
    }

    public getToken(): string {
        return localStorage.getItem(this.tokenKey);
    }

}
