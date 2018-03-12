import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import 'rxjs/add/operator/pairwise';

@Component({
    selector: 'app-table-page',
    templateUrl: './table-page.component.html',
    styleUrls: ['./table-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TablePageComponent implements OnInit {

    params: any = {}; // Setup params

    constructor(private _router: Router,
                private _route: ActivatedRoute) {
    }

    ngOnInit() {
        this._route.queryParams.subscribe(params => {
            this.params = this._route.snapshot.data;
        });
    }
}


