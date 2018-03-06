import {Injectable} from '@angular/core';
import {ApiService} from '../../api/api.service';
import {Router, Routes} from '@angular/router';
import {environment} from '../../../environments/environment';
import {DashboardPageComponent} from '../pages/dashboard-page/dashboard-page.component';
import {TablePageComponent} from '../pages/table-page/table-page.component';
import {FormPageComponent} from '../pages/form-page/form-page.component';
import {ProfilePageComponent} from '../pages/profile-page/profile-page.component';
import {NotfoundPageComponent} from '../pages/notfound-page/notfound-page.component';
import {UtilsService} from '../../services/utils.service';
import {UserService} from '../../auth/services/user.service';
import {LanguageService} from './language.service';

const TYPES = {
    profile: ProfilePageComponent,
    dashboard: DashboardPageComponent,
    table: TablePageComponent,
    form: FormPageComponent,
    notFound: NotfoundPageComponent
};

@Injectable()
export class SetupService {

    constructor(private _router: Router,
                private _userService: UserService,
                private _apiService: ApiService,
                private _languageService: LanguageService) {
    }

    public setup(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this._apiService.get(environment.api.setupEndpoint)
                .then((data) => {

                    if ('contentLanguages' in data) {
                        this._languageService.setContentLanguages(data['contentLanguages']);
                    }

                    this.loadRoutes(data);
                    const menu = this.prepareMenu(data);
                    resolve(menu);
                })
                .catch((error) => {
                    this._userService.removeToken();
                    this._userService.removeUser();
                    this._router.navigate(['login']);
                    reject();
                });
        });
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

        const routes = [];

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

        /** Add not found page */
        routes.push({
            path: '**',
            component: TYPES.notFound
        });

        routerConfig[0].children = routes;
        this._router.resetConfig(routerConfig);
    }

    private remapMenu(data: any): any[] {
        let menu = [];

        for (const item of ('pages' in data) ? data.pages : data) {
            if ('type' in item) {
                // Is a component
                if (item.type === 'group') {
                    if ('children' in item) {
                        if (item.params.menu) {
                            item.params.menu['children'] = this.remapMenu(item.children);
                            menu.push(item.params.menu);
                        }
                    }
                } else {
                    if (item.params.menu) {
                        if (item.params.menu.sidebar === true) {
                            item.params.menu.path = item.path;
                            menu.push(item.params.menu);
                        }
                    }
                }
            } else if ('children' in item) {
                menu = menu.concat(this.remapMenu(item.children));
            }
        }

        return menu;
    }

    private prepareMenu(data: any): any[] {
        let menu = this.remapMenu(data);
        menu = UtilsService.sortByKey(menu, 'order');

        return menu;
    }
}
