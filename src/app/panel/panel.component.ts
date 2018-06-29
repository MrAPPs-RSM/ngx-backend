import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {User, UserService} from '../auth/services/user.service';
import {environment} from '../../environments/environment';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {PageRefreshService} from '../services/page-refresh.service';
import {LanguageService} from './services/language.service';

import 'rxjs/add/operator/map';
import {MenuService} from './services/menu.service';

declare const $: any;

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PanelComponent implements OnInit, AfterViewInit {

    title = environment.name;
    showLogo: boolean = environment.assets.logo !== false;
    logo = environment.assets.logo;
    menu: any[] = [];
    homePage = 'dashboard';
    user: User;

    constructor(private _router: Router,
                private _userService: UserService,
                private _route: ActivatedRoute,
                private _languageService: LanguageService,
                private _pageRefresh: PageRefreshService,
                private _menuService: MenuService) {
    }

    ngOnInit() {

        console.log('SUCCESS PANEL RESOLVER');

        /** When start, if current lang not set, set it from the enviroment defaults */
        if (this._languageService.isMultiLang() && !this._languageService.getCurrentLang()) {
            this._languageService.setCurrentLang(environment['currentLang']);
        }

        /** Date pickers locale */
        this._languageService.setDatePickerLocale();

        this.menu = this._menuService.getMenu();

        /** Search for home page */
        (this._router.config as any).every((item: Route) => {
            if (environment.domains) {
                let panelConfig = null;
                environment.domains.forEach((domain) => {
                    if (this._router.url.indexOf(domain.name) > -1) {
                        if (item.path === domain.name) {
                            panelConfig = item.children[0];
                        }
                    }
                });

                (panelConfig.children as any).every((child) => {
                    if ('data' in child && 'isHomePage' in child.data && child.data['isHomePage']) {
                        this.homePage = child.path;
                        return false;
                    } else {
                        return true;
                    }
                });
            } else {
                if (item.path === 'panel') {
                    (item.children as any).every((child) => {
                        if ('data' in child && 'isHomePage' in child.data && child.data['isHomePage']) {
                            this.homePage = child.path;
                            return false;
                        } else {
                            return true;
                        }
                    });
                    return false;
                } else {
                    return true;
                }
            }
        });

        const redirectTo404 = () => {
            this._router.navigate(['../panel/404'], {relativeTo: this._route});
        };

        if (this._router.url === '/panel') {
            this._router.navigate(['../panel/' + this.homePage], {relativeTo: this._route}).catch(redirectTo404);
        } else {
            this._router.navigateByUrl(this._router.url).catch(redirectTo404);
        }

        this.user = this._userService.getUser();
    }

    ngAfterViewInit() {
        if ($(window).width() <= 768) {
            this.toggleSidebar(null, true);
        }
    }

    logout(): void {
        this._userService.removeToken();
        this._userService.removeUser();
        this._languageService.removeLang();
        this._pageRefresh.reset();
        this._router.navigate(['../login'], {relativeTo: this._route});
    }

    redirect(route: string): void {
        this._router.navigate(['../panel/' + route], {relativeTo: this._route});

        if ($(window).width() <= 768) {
            this.toggleSidebar();
        }
    }

    toggleSidebar($event?: any, close?: boolean): void {
        if ($event) {
            $event.preventDefault();
        }
        const wrapper = $('div#wrapper');

        if (close) {
            wrapper.addClass('sidebar-closed');
        } else {
            wrapper.toggleClass('sidebar-closed');
        }
    }

    onGroupClick($event: any): void {
        const element = $($event.target);
        element.toggleClass('open');
        $(element.next('ul')).slideToggle();
    }
}
