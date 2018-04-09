import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PasswordChangeGuard implements CanActivate {

    constructor(private _router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if ('access_token' in next.queryParams) {
            return true;
        } else {
            this._router.navigate(['login']);
            return false;
        }
    }
}
