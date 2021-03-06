
import {empty as observableEmpty, Observable} from 'rxjs';

import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {PanelComponent} from '../panel.component';
import {SetupService} from '../services/setup.service';


import {ToastsService} from '../../services/toasts.service';
import {UserService} from '../../auth/services/user.service';
import {LanguageService} from '../services/language.service';
import {PageRefreshService} from '../../services/page-refresh.service';

@Injectable()
export class PanelResolver implements Resolve<PanelComponent> {

    constructor(private _setupService: SetupService,
                private _router: Router,
                private _route: ActivatedRoute,
                private _languageService: LanguageService,
                private _pageRefresh: PageRefreshService,
                private _userService: UserService,
                private _toasts: ToastsService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._setupService.setup().pipe(catchError((error) => {
            this._toasts.error(error);
            this._userService.removeToken();
            this._userService.removeUser();
            this._languageService.removeLang();
            this._pageRefresh.reset();
            this._router.navigate(['../login'], {relativeTo: this._route});
            return observableEmpty();
        }));
    }
}
