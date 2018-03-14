import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import 'rxjs/add/operator/pairwise';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-table-page',
    templateUrl: './table-page.component.html',
    styleUrls: ['./table-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TablePageComponent implements OnInit, OnDestroy {

    params: any = {}; // Setup params

    private _subscription = Subscription.EMPTY;

    constructor(private _router: Router,
                private _route: ActivatedRoute) {
    }

    ngOnInit() {
       this._subscription = this._route.queryParams.subscribe(params => {
            this.params = this._route.snapshot.data;
        });
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}


