import {Injectable} from '@angular/core';
import {ApiService} from '../../api/api.service';
import {Router} from '@angular/router';
import {TokenService} from '../../auth/token.service';
import {environment} from '../../../environments/environment';
import {DashboardPageComponent} from '../pages/dashboard-page/dashboard-page.component';
import {TablePageComponent} from '../pages/table-page/table-page.component';
import {FormPageComponent} from '../pages/form-page/form-page.component';
import {UtilsService} from '../../services/utils.service';

const TYPES = {
    dashboard: DashboardPageComponent,
    table: TablePageComponent,
    form: FormPageComponent
};

@Injectable()
export class SetupService {

    constructor(private _router: Router,
                private _tokenService: TokenService,
                private _apiService: ApiService) {
    }

    public setup(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this._apiService.get(environment.api.setupEndpoint)
                .then((data) => {
                    this.loadRoutes(data);
                    const menu = this.prepareMenu(data);
                    resolve(menu);
                })
                .catch((error) => {
                    // Might never happen, in case, logout the user
                    this._tokenService.removeToken();
                    this._router.navigate(['login']);
                    reject(error);
                });
        });
    }

    private remapRoutesData(data: any, ): Array<any> {
        let routes = [];

        for (const item of data) {
            if ('children' in item) {
                routes = routes.concat(this.remapRoutesData(item.children));
            } else {
                routes.push(item);
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

        routerConfig[1].children = routes;
        this._router.resetConfig(routerConfig);
    }


    private remapMenu(data: any): any[] {
        let menu = [];

        for (const item of data) {
            if ('type' in item) {
                // Is a component
                if (item.type === 'group' || 'children' in item) {
                    item.params.menu['children'] = this.remapMenu(item.children);
                    menu.push(item.params.menu);
                } else {
                    if (item.params.menu.sidebar === true) {
                        item.params.menu.path = item.path;
                        menu.push(item.params.menu);
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
