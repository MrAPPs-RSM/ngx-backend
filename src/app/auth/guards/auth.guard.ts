import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../services/user.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private _userService: UserService, private _router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (this._userService.getToken() !== null) {
            return true;
        } else {
            if (environment.domains) {
                this._router.navigate(['/' + next.params.domain + '/login']);
            } else {
                this._router.navigate(['login']);
            }
            return false;
        }
    }
}
