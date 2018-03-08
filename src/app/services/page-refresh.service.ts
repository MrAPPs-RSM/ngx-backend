import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class PageRefreshService {

    private key = 'last_path';

    constructor(protected _router: Router) {
    }

    public setLastPath(path: string): void {
        localStorage.setItem(this.key, path);
    }

    public getLastPath(): string {
        return localStorage.getItem(this.key);
    }

    public renavigate(): void {
        this._router.navigateByUrl(localStorage.getItem(this.key));
    }

    public reset(): void {
        localStorage.removeItem(this.key);
    }
}
