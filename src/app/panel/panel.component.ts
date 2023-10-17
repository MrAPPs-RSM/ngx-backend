import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {User, UserService} from '../auth/services/user.service';
import {environment} from '../../environments/environment';
import {ActivatedRoute, NavigationEnd, Route, Router} from '@angular/router';
import {PageRefreshService} from '../services/page-refresh.service';
import {LanguageService} from './services/language.service';


import {MenuService} from './services/menu.service';
import {StorageService} from '../services/storage.service';
import { filter, map, take } from 'rxjs/operators';

declare const $: any;

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PanelComponent implements OnInit, AfterViewInit {

    title = environment.name;
    logo = environment.assets.logo;
    menu: any[] = [];
    homePage = 'dashboard';
    user: User;
    menuParentSelected;


    constructor(private _router: Router,
                private _userService: UserService,
                private _route: ActivatedRoute,
                private _storageService: StorageService,
                private _languageService: LanguageService,
                private _pageRefresh: PageRefreshService,
                private _menuService: MenuService) {
                    
                  
    }

    get showLogo() {
        return environment.assets && environment.assets.logo;
    }

    ngOnInit() {
        /** When start, if current lang not set, set it from the enviroment defaults */
        if (!this._languageService.getCurrentLang()) {
            this._languageService.setCurrentLang(environment['currentLang']);
        }

        /** Date pickers locale */
        this._languageService.setDatePickerLocale();

        this.menu = this._menuService.getMenu();

        this._router.events.pipe(filter(event => event instanceof NavigationEnd), take(1))
        .subscribe(event => 
         {     
             this.menuParentSelected= this.menu.findIndex(function(o) {
              return o.children.some(function(e) {
                return e.path == event['url'].split("/panel/").pop();
              })
            })
         });

        /** Search for home page */
        let routerConfig = this._router.config;
        if (environment.domains) {
            routerConfig = this._router.config[0].children;
        }

        (routerConfig as any).every((item: Route) => {
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

        const redirectTo404 = () => {
            this._router.navigate(['../panel/404'], {relativeTo: this._route});
        };

        if (this._router.url.endsWith('/panel')) {
            this._router.navigate(['../panel/' + this.homePage], {relativeTo: this._route}).catch(redirectTo404);
        } else {
            this._router.navigateByUrl(this._router.url).catch(redirectTo404);
        }

        this.user = this._userService.getUser();
    }

    setSectionSelected(i) {

        if (i === this.menuParentSelected) {
            return {
                "background-color": 'rgba(255,255,255,0.2)'
            }
        }
    }
    

    ngAfterViewInit() {
        if ($(window).width() <= 768) {
            this.toggleSidebar(null, true);
        }
    }

    logout(): void {
        this._userService.cleanupData();
        this._languageService.removeLang();
        this._pageRefresh.reset();
        this._router.navigate(['../login'], {relativeTo: this._route});

        if (environment.domains) {
            this._storageService.clearValue('domain');
        }
    }

    redirect(route: string, i?: number): void {
        this._router.navigate(['../panel/' + route], {relativeTo: this._route});
        
        if ($(window).width() <= 768) {
            this.toggleSidebar();
        }

        this.menuParentSelected = null;
        if (i || i === 0) {
            this.menuParentSelected = i;
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
