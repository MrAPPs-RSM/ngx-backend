import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {User, UserService} from '../auth/services/user.service';
import {environment} from '../../environments/environment';
import {ActivatedRoute, NavigationEnd, Route, Router} from '@angular/router';
import {PageRefreshService} from '../services/page-refresh.service';
import {LanguageService} from './services/language.service';
import {PageTitleService} from './services/page-title.service';

import 'rxjs/add/operator/map';
import {NotfoundPageComponent} from './pages/notfound-page/notfound-page.component';
import {MenuService} from './services/menu.service';

declare const $: any;

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PanelComponent implements OnInit {

    title = environment.name;
    showLogo: boolean = environment.logo;
    logo = '../../../../../assets/images/logo.png';
    menu: any[] = [];
    homePage = 'dashboard';
    user: User;

    constructor(private _router: Router,
                private _userService: UserService,
                private _route: ActivatedRoute,
                private _languageService: LanguageService,
                private _pageRefresh: PageRefreshService,
                private _menuService: MenuService,
                private _pageTitle: PageTitleService) {
    }

    ngOnInit() {

        console.log("PANEL INIT...");
        this._router.events
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

                if (activatedRoute.component.name !== 'PanelComponent') {

                    if (activatedRoute.component.name === 'NotfoundPageComponent') {
                        this._pageTitle.set(this._languageService.translate('404.page_title'));
                    } else {
                        this._pageTitle.set(activatedRoute);
                    }
                }
            });


        /** When start, if current lang not set, set it from the enviroment defaults */
        if (this._languageService.isMultiLang() && !this._languageService.getCurrentLang()) {
            this._languageService.setCurrentLang(environment['currentLang']);
        }

        this.menu = this._menuService.getMenu();


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

            // console.log(this._router.url);

            const redirectTo404 = () => {
                this._router.navigate(['panel/404']);
            };

            if (this._router.url === '/panel') {
                this._router.navigate(['panel/' + this.homePage]).catch(redirectTo404);
            } else {
                this._router.navigateByUrl(this._router.url).catch(redirectTo404);
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
