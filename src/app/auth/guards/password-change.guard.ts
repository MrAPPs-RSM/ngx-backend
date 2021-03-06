import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {ACCESS_TOKEN_KEY, UserService} from '../services/user.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class PasswordChangeGuard implements CanActivate {

    constructor(private _userService: UserService, private _router: Router, private _route: ActivatedRoute) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const prefix = environment.domains ? '/' + next.params.domain + '/' : '';

        if (environment.auth.passwordChange) {
            if (this._userService.getToken() !== null) {
                this._router.navigate([prefix + 'panel']);
                return false;
            } else {
                if (!(ACCESS_TOKEN_KEY in next.queryParams)) {
                    this._router.navigate([prefix + 'login']);
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            if (this._userService.getToken() !== null) {
                this._router.navigate([prefix + 'panel']);
                return false;
            } else {
                this._router.navigate([prefix + 'login']);
                return false;
            }
        }
    }
}
