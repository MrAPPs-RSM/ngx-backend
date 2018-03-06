import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {User, UserService} from '../auth/services/user.service';
import {environment} from '../../environments/environment';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {PageRefreshService} from '../services/page-refresh.service';
import {LanguageService} from './services/language.service';

declare const $: any;

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PanelComponent implements OnInit {

    title = environment.name;
    menu: any[] = [];
    homePage = 'dashboard';
    user: User;

    constructor(private _router: Router,
                private _userService: UserService,
                private _route: ActivatedRoute,
                private _languageService: LanguageService,
                private _pageRefresh: PageRefreshService) {
    }

    ngOnInit() {
        /** When start, if current lang not set, set it from the enviroment defaults */
        if (!this._languageService.getCurrentLang()) {
            this._languageService.setCurrentLang(environment.currentLang);
        }

        if (this._route.snapshot.data['params'] && this._route.snapshot.data['params'].length > 0) {
            this.menu = this._route.snapshot.data['params'];
        }

        /** Search for home page */
        (this._router.config as any).every((item: Route) => {
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
        });

        if (this._pageRefresh.getLastPath() !== null) {
            if (this._pageRefresh.getLastPath() !== '/panel'
                && this._pageRefresh.getLastPath() !== '/login') {
                this._pageRefresh.renavigate();
            } else {
                this._router.navigate(['panel/' + this.homePage]);
            }
        } else {
            this._router.navigate(['panel/' + this.homePage]);
        }

        this.user = this._userService.getUser();
    }


    logout(): void {
        this._userService.removeToken();
        this._userService.removeUser();
        this._pageRefresh.reset();
        this._router.navigate(['login']);
    }

    toggleSidebar(): void {
        const wrapper = $('div#wrapper');
        wrapper.toggleClass('sidebar-closed');
    }

    onGroupClick($event: any): void {
        const element = $($event.target);
        element.toggleClass('open');
        $(element.next('ul')).slideToggle();
    }
}
