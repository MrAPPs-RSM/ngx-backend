import {Injectable} from '@angular/core';
import {ApiService} from '../../api/api.service';
import {Router} from '@angular/router';
import {TokenService} from '../../auth/token.service';
import {environment} from '../../../environments/environment';
import {DashboardPageComponent} from '../pages/dashboard-page/dashboard-page.component';
import {TablePageComponent} from '../pages/table-page/table-page.component';
import {FormPageComponent} from '../pages/form-page/form-page.component';

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
                    location.reload();
                });
        });
    }

    private loadRoutes(data: any): void {

        const routerConfig = this._router.config;

        const routes = [];

        data.forEach((item) => {
            if (!item.type) {
                // Is redirect object
                const redirect = {
                    path: item.path,
                    redirectTo: item.redirectTo,
                    pathMatch: 'full'
                };
                routes.push(redirect);
            } else {
                // Is a component
                if (item.type === 'group') {
                    item.children.forEach((child) => {
                        const childRoute = {
                            path: child.path,
                            component: TYPES[child.type],
                            data: child.params
                        };
                        routes.push(childRoute);
                    });
                } else {
                    const route = {
                        path: item.path,
                        component: TYPES[item.type],
                        data: item.params
                    };
                    routes.push(route);
                }
            }
        });

        routerConfig[1].children = routes;
        this._router.resetConfig(routerConfig);

        // TODO: remove this
        console.log(this._router.config);
    }

    private prepareMenu(data: any): any[] {
        const menu = [];

        data.forEach((item) => {
            if (item.type) {
                // Is a component
                if (item.type === 'group') {
                    item.params.menu['children'] = [];
                    item.children.forEach((child) => {
                        child.params.menu.path = child.path;
                        item.params.menu.children.push(child.params.menu);
                    });
                    menu.push(item.params.menu);
                } else {
                    item.params.menu.path = item.path;
                    menu.push(item.params.menu);
                }
            }
        });

        return menu;
    }
}
