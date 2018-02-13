import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TokenService} from '../auth/token.service';
import {environment} from '../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {GlobalState} from '../global.state';
import {PageRefreshService} from '../services/page-refresh.service';

declare const $: any;

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PanelComponent implements OnInit {

    public title = environment.name;
    public menu: any[] = [];

    public activePage: string;
    public breadcrumb: any[] = [];

    constructor(private _state: GlobalState,
                private _router: Router,
                private _tokenService: TokenService,
                private _route: ActivatedRoute,
                private _pageRefresh: PageRefreshService) {
    }

    ngOnInit() {
        this.menu = this._route.snapshot.data['params'];
        this.loadBreadcrumb();
        if (this._pageRefresh.getLastPath() !== null) {
            this._pageRefresh.renavigate();
        } else {
            this._router.navigate(['panel/dashboard']);
        }
    }

    loadBreadcrumb(): void {
        this._state.subscribe('activePage', (activeLink) => {
            if (activeLink) {
                this.activePage = activeLink.title;
                if (activeLink.route) {
                    if (activeLink.breadcrumbLevel === 1) {
                        this.breadcrumb = [];
                        this.breadcrumb.push(activeLink);
                    } else {
                        const indexesToDelete = [];
                        this.breadcrumb.forEach((link, index) => {
                            if (link.breadcrumbLevel > activeLink.breadcrumbLevel) {
                                indexesToDelete.push(index);
                            }
                        });

                        if (indexesToDelete.length) {
                            indexesToDelete.forEach((index) => {
                                this.breadcrumb.splice(index, 1);
                            });
                        } else {
                            this.breadcrumb.push(activeLink);
                        }
                    }
                } else {
                    this.breadcrumb = [];
                }
            }
        });
    }

    logout(): void {
        this._tokenService.removeToken();
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
