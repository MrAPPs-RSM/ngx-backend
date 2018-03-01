import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../auth/user.service';
import {environment} from '../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {PageRefreshService} from '../services/page-refresh.service';

declare const $: any;

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PanelComponent implements OnInit {

    private title = environment.name;
    private menu: any[] = [];
    private user: any;

    constructor(private _router: Router,
                private _userService: UserService,
                private _route: ActivatedRoute,
                private _pageRefresh: PageRefreshService) {
    }

    ngOnInit() {
        if (this._route.snapshot.data['params'] && this._route.snapshot.data['params'].length > 0) {
            this.menu = this._route.snapshot.data['params'];
        }

        if (this._pageRefresh.getLastPath() !== null) {
            if (this._pageRefresh.getLastPath() !== '/panel'
            && this._pageRefresh.getLastPath() !== '/login') {
                this._pageRefresh.renavigate();
            } else {
                this._router.navigate(['panel/dashboard']);
            }
        } else {
            this._router.navigate(['panel/dashboard']);
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
