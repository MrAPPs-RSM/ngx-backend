import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PageTitleService} from '../../services/page-title.service';
import {PageRefreshService} from '../../../services/page-refresh.service';

@Component({
    selector: 'app-dashboard-page',
    templateUrl: './dashboard-page.component.html',
    styleUrls: ['./dashboard-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardPageComponent implements OnInit, OnDestroy {

    private params: any = {}; // Setup params

    constructor(private _router: Router,
                private _route: ActivatedRoute,
                private _pageTitle: PageTitleService,
                private _pageRefresh: PageRefreshService) {
    }

    ngOnInit() {
        this.params = this._route.snapshot.data;
        console.log(this.params);
        this._pageTitle.set(this._route);
    }

    ngOnDestroy() {
        this._pageRefresh.setLastPath(this._router.url);
    }
}
