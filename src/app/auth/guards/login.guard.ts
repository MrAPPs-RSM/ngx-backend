import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../services/user.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class LoginGuard implements CanActivate {

    constructor(private _userService: UserService, private _router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this._userService.getToken() !== null) {

            if (environment.domains) {
                this._router.navigate(['/' + next.params.domain + '/panel']);
            } else {
                this._router.navigate(['panel']);
            }
            return false;
        } else {
            return true;
        }
    }
}
