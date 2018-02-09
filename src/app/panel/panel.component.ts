import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TokenService} from '../auth/token.service';
import {environment} from '../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';

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

    constructor(private _router: Router,
                private _tokenService: TokenService,
                private _route: ActivatedRoute) {
    }

    ngOnInit() {
        this.menu = this._route.snapshot.data['params'];
        this._router.navigate(['panel/dashboard']);
    }

    logout(): void {
        this._tokenService.removeToken();
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
