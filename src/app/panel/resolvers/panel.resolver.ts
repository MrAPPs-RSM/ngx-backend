import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {PanelComponent} from '../panel.component';
import {Observable} from 'rxjs/Observable';
import {SetupService} from '../services/setup.service';
import {UserService} from '../../auth/services/user.service';

@Injectable()
export class PanelResolver implements Resolve<PanelComponent> {

    constructor(private _router: Router,
                private _setupService: SetupService,
                private _userService: UserService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            this._setupService.setup()
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                console.log(error);
                    this._userService.removeToken();
                    this._userService.removeUser();
                    this._router.navigate(['login']);
                });
        });
    }
}
