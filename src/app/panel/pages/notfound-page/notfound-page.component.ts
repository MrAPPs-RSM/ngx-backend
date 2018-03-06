import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {PageTitleService} from '../../services/page-title.service';
import {PageRefreshService} from '../../../services/page-refresh.service';

@Component({
    selector: 'app-notfound-page',
    templateUrl: './notfound-page.component.html',
    styleUrls: ['./notfound-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NotfoundPageComponent implements OnInit, OnDestroy {

    constructor(private _router: Router,
                private _pageTitle: PageTitleService,
                private _pageRefresh: PageRefreshService) {
    }

    ngOnInit() {
        this._pageTitle.set('404 - Not found');
    }

    ngOnDestroy() {
        this._pageRefresh.setLastPath(this._router.url);
    }
}
