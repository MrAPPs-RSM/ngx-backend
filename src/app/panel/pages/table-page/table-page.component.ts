import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PageTitleService} from '../../services/page-title.service';
import {PageRefreshService} from '../../../services/page-refresh.service';

@Component({
    selector: 'app-table-page',
    templateUrl: './table-page.component.html',
    styleUrls: ['./table-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TablePageComponent implements OnInit, OnDestroy {

    private params: any = {}; // Setup params

    constructor(private _router: Router,
                private _route: ActivatedRoute,
                private _pageTitle: PageTitleService,
                private _pageRefresh: PageRefreshService) {
    }

    ngOnInit() {
        console.log("qui ci passa?");
        this.params = this._route.snapshot.data;
        this._pageTitle.set(this._route);
    }

    ngOnDestroy() {
        console.log(this._router.url);
        this._pageRefresh.setLastPath(this._router.url);
    }
}
