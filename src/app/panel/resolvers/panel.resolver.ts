import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {PanelComponent} from '../panel.component';
import {Observable} from 'rxjs/Observable';
import {SetupService} from '../services/setup.service';

@Injectable()
export class PanelResolver implements Resolve<PanelComponent> {

    constructor(private _setupService: SetupService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            this._setupService.setup()
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {});
        });
    }
}
