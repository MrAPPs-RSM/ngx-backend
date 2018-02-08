import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {TokenService} from './token.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private _tokenService: TokenService, private _router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this._tokenService.getToken() !== null) {
            return true;
        } else {
            this._router.navigate(['login']);
            return false;
        }
    }
}
