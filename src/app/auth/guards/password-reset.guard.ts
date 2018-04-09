import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../services/user.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class PasswordResetGuard implements CanActivate {

    constructor(private _userService: UserService, private _router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (environment.auth.passwordReset) { // If password reset form is defined
            if (this._userService.getToken() !== null) {
                this._router.navigate(['panel']);
                return false;
            } else {
                return true;
            }
        } else {
            if (this._userService.getToken() !== null) {
                this._router.navigate(['panel']);
                return false;
            } else {
                this._router.navigate(['login']);
                return false;
            }
        }
    }
}
