import {Component, ViewEncapsulation, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {PageTitleService} from './panel/services/page-title.service';
import {LanguageService} from './panel/services/language.service';
import {MenuService} from './panel/services/menu.service';
import {GlobalState} from './global.state';
import {Subscription} from 'rxjs/Subscription';
import {UtilsService} from './services/utils.service';
import {environment} from '../environments/environment';
import {ApiService} from './api/api.service';
import {StorageService} from "./services/storage.service";
import {UserService} from "./auth/services/user.service";
import {PageRefreshService} from "./services/page-refresh.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {

    private _routerSub = Subscription.EMPTY;
    private _activePageSub = Subscription.EMPTY;

    private firstRoute = true;

    constructor(private _router: Router,
                private _route: ActivatedRoute,
                private _state: GlobalState,
                private _userService: UserService,
                private _pageRefresh: PageRefreshService,
                private _storageService: StorageService,
                private _languageService: LanguageService,
                private _apiService: ApiService,
                private _pageTitle: PageTitleService,
                private _menuService: MenuService) {
    }

    ngOnInit() {

        if (environment.production) {
            window.console.log = function () {
            };
        }

        this._routerSub = this._router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this._route)
            .map((route) => {
                while (route.firstChild) {
                    route = route.firstChild;
                }
                return route;
            })
            .filter((route) => route.outlet === 'primary')
            .subscribe((activatedRoute: any) => {

                if (environment.domains) {
                    const currentPath: string = activatedRoute.snapshot['_routerState'].url;
                    const currentDomain: string = this._storageService.getValue('domain');

                    if (currentPath.indexOf('panel') > -1) {
                        if (!activatedRoute.parent.snapshot.params.hasOwnProperty('domain') ||
                            activatedRoute.parent.snapshot.params.domain !== currentDomain) {

                            this._userService.removeToken();
                            this._userService.removeUser();
                            this._languageService.removeLang();
                            this._pageRefresh.reset();
                            this._storageService.clearValue('domain');

                            if (activatedRoute.parent.snapshot.params.hasOwnProperty('domain')) {
                                this._router.navigate(['/' + activatedRoute.parent.snapshot.params.domain + '/login']);
                            } else {
                                // TODO: may never happen but, what to do in this case?
                            }
                        }
                    }
                }

                if (activatedRoute.component.name !== 'PanelComponent') {
                    // skipping for first panel redirect to the current route
                    if (this.firstRoute) {
                        this.firstRoute = false;
                        return;
                    }

                    if (activatedRoute.component.name === 'NotfoundPageComponent') {
                        this._pageTitle.set(this._languageService.translate('404.page_title'));
                    } else {
                        this._pageTitle.set(activatedRoute);
                    }
                }
            });

        this._activePageSub = this._state._activePageSubject.subscribe((activeLink) => {

            if (activeLink) {
                //  this.activePage = activeLink.url;

                if (this._menuService.breadcrumbs.length === 0) {
                    this._menuService.breadcrumbs.push(activeLink);
                } else {
                    if (this.isResetNeeded(activeLink)) {
                        this._menuService.breadcrumbs = [activeLink];
                    } else {
                        let found = false;

                        for (let i = this._menuService.breadcrumbs.length; i--;) {
                            const breadcrumb = this._menuService.breadcrumbs[i];

                            const breadcrumbUrl = this.removePaginationParams(breadcrumb.url);
                            const linkUrl = this.removePaginationParams(activeLink.url);

                            if (breadcrumb.url === activeLink.url) {
                                found = true;
                                this._menuService.breadcrumbs.splice(i + 1);
                                break;
                            } else if (breadcrumbUrl === linkUrl) {
                                found = false;
                                this._menuService.breadcrumbs.splice(this._menuService.breadcrumbs.length - 1);
                                break;
                            }
                        }

                        if (!found) {
                            if (this._apiService.isRedirecting || this._state.replaceLastPath) {
                                this._state.replaceLastPath = false;
                                this._menuService.breadcrumbs.splice(this._menuService.breadcrumbs.length - 1);
                            }

                            this._menuService.breadcrumbs.push(activeLink);
                        }
                    }
                }
            }
        });

    }

    ngOnDestroy() {
        this._routerSub.unsubscribe();
        this._activePageSub.unsubscribe();
    }

    private objToQueryParams(obj) {
        const str = [];
        for (const p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        }
        return str.join('&');
    }

    private queryParamsToObj(queryParams) {
        return JSON.parse('{"' + queryParams.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    }

    private removePaginationParams(url: string): string {
        const uri = decodeURI(url);
        if (uri.indexOf('?') > -1) {
            const queryParams = uri.split('?')[1];
            const obj = this.queryParamsToObj(queryParams);
            delete obj.page;
            delete obj.perPage;
            const newParams = this.objToQueryParams(obj);
            return uri.split('?')[0] + '?' + newParams;
        } else {
            return url;
        }
    }

    private hasSameParentPath(activeLink: any): boolean {

        if (this._menuService.breadcrumbs.length === 0) {
            return false;
        }

        const currentParent = this._menuService.breadcrumbs[0].route.split('/')[2];
        const newParent = activeLink.route.split('/')[2];

        return currentParent === newParent;
    }

    private breadcrumbAlreadyIn(activeLink: any): boolean {

        for (const breadcrumb of this._menuService.breadcrumbs) {
            if (breadcrumb.route === activeLink.route) {
                return true;
            }
        }

        return false;
    }


    private isResetNeeded(activeLink: any): boolean {
        return activeLink.breadcrumbLevel === 1
            && !(this.breadcrumbAlreadyIn(activeLink))
            && UtilsService.isEmptyObject(JSON.parse(activeLink.params))
            && this.hasSameParentPath(activeLink)
            || !this.hasSameParentPath(activeLink)
            || (activeLink.breadcrumbLevel === 1 && this._menuService.breadcrumbs[0].breadcrumbLevel !== 1);
    }
}
