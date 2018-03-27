import {Injectable} from '@angular/core';
import {ApiService} from '../../api/api.service';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {DashboardPageComponent} from '../pages/dashboard-page/dashboard-page.component';
import {TablePageComponent} from '../pages/table-page/table-page.component';
import {FormPageComponent} from '../pages/form-page/form-page.component';
import {ProfilePageComponent} from '../pages/profile-page/profile-page.component';
import {LanguageService} from './language.service';
import {MenuService} from './menu.service';
import {NotfoundPageComponent} from '../pages/notfound-page/notfound-page.component';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';


const TYPES = {
    profile: ProfilePageComponent,
    dashboard: DashboardPageComponent,
    table: TablePageComponent,
    form: FormPageComponent,
};

@Injectable()
export class SetupService {

    public _lastRouteLoading: Date;

    constructor(private _router: Router,
                private _menuService: MenuService,
                private _apiService: ApiService,
                private _languageService: LanguageService) {
    }

    public setup(): Observable<any> {
        const promise = new Promise<any>((resolve, reject) => {

            if (this._lastRouteLoading == null || Date.now() - this._lastRouteLoading.getMilliseconds() < 10000) {
                this._apiService.get(environment.api.setupEndpoint)
                    .then((data) => {

                        this._lastRouteLoading = new Date();

                        if ('contentLanguages' in data) {
                            this._languageService.setContentLanguages(data['contentLanguages']);
                        }

                        this.loadRoutes(data);
                        // console.log("CARICAMENTO ROTTE...");
                        this._menuService.prepareMenu(data);
                        resolve();
                    })
                    .catch((error) => {
                        this._lastRouteLoading = null;
                        reject();
                    });
            } else {
                // console.log("SALTO CARICAMENTO ROTTE...");
                resolve();
            }
        });

        return Observable.fromPromise(promise);
    }

    private remapRoutesData(data: any): Array<any> {
        let routes = [];

        if ('pages' in data) {
            routes = routes.concat(this.remapRoutesData(data.pages));
        } else {
            for (const item of data) {
                if ('children' in item) {
                    routes = routes.concat(this.remapRoutesData(item.children));
                } else {
                    routes.push(item);
                }
            }
        }

        return routes;
    }

    private loadRoutes(data: any): void {

        const routerConfig = this._router.config;

        const routes = [{path: '404', component: NotfoundPageComponent}];


        for (const item of this.remapRoutesData(data)) {

            if (item.type in TYPES) {
                const route = {
                    path: item.path,
                    component: TYPES[item.type],
                    data: item.params
                };
                routes.push(route);
            }
        }

        routerConfig[0].children = routes;
        this._router.resetConfig(routerConfig);
    }

}
