import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable()
export class TokenService {

    constructor() {
    }

    public key = environment.auth.tokenKey;

    public storeToken(token: string): void {
        localStorage.setItem(this.key, token);
    }

    public removeToken(): void {
        localStorage.removeItem(this.key);
    }

    public getToken(): string {
        return localStorage.getItem(this.key);
    }

}
