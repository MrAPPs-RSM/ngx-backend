import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {PanelComponent} from '../panel.component';
import {SetupService} from '../services/setup.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/empty';
import {ToastsService} from '../../services/toasts.service';
import {UserService} from '../../auth/services/user.service';
import {LanguageService} from '../services/language.service';
import {PageRefreshService} from '../../services/page-refresh.service';

@Injectable()
export class PanelResolver implements Resolve<PanelComponent> {

    constructor(private _setupService: SetupService,
                private _router: Router,
                private _languageService: LanguageService,
                private _pageRefresh: PageRefreshService,
                private _userService: UserService,
                private _toasts: ToastsService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        console.log('PANEL RESOLVER');
        return this._setupService.setup().catch((error) => {
            this._toasts.error(error);
            this._userService.removeToken();
            this._userService.removeUser();
            this._languageService.removeLang();
            this._pageRefresh.reset();
            this._router.navigate(['login']);
            return Observable.empty();
        });
    }
}
