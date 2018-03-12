import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {PanelComponent} from '../panel.component';
import {Observable} from 'rxjs/Observable';
import {SetupService} from '../services/setup.service';

@Injectable()
export class PanelResolver implements Resolve<PanelComponent> {

    constructor(private _setupService: SetupService, private _router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            this._setupService.setup()
                .then((data) => {
                    console.log("   DI QUI CI è PASSATO!!");
                    resolve(data);
                })
                .catch((error) => {
                    this._router.navigate(['login']);
                    resolve();
                });
        });
    }
}
