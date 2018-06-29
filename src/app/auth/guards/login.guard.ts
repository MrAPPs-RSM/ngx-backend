import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../services/user.service';

@Injectable()
export class LoginGuard implements CanActivate {

    constructor(private _userService: UserService, private _router: Router, private _route: ActivatedRoute) {
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this._userService.getToken() !== null) {
            this._router.navigate(['../panel'], {relativeTo: this._route});
            return false;
        } else {
            return true;
        }
    }
}
