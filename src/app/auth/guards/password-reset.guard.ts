import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../services/user.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class PasswordResetGuard implements CanActivate {

    constructor(private _userService: UserService, private _router: Router, private _route: ActivatedRoute) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const prefix = environment.domains ? '/' + next.params.domain + '/' : '';

        if (environment.auth.passwordReset) { // If password reset form is defined
            if (this._userService.getToken() !== null) {
                this._router.navigate([prefix + 'panel']);
                return false;
            } else {
                return true;
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
