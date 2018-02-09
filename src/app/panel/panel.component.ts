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

    constructor(private _tokenService: TokenService,
                private _route: ActivatedRoute) {
    }

    ngOnInit() {
        console.log(this._route.snapshot.data['params']);
    }

    logout(): void {
        this._tokenService.removeToken();
        location.reload();
    }

    toggleSidebar(): void {
        const wrapper = $('div#wrapper');
        wrapper.toggleClass('sidebar-closed');
    }
}
