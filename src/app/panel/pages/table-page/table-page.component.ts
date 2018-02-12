import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PageTitleService} from '../../services/page-title.service';

@Component({
    selector: 'app-table-page',
    templateUrl: './table-page.component.html',
    styleUrls: ['./table-page.component.scss']
})
export class TablePageComponent implements OnInit {

    private params: any = {}; // Setup params

    constructor(private _route: ActivatedRoute,
                private _pageTitle: PageTitleService) {
    }

    ngOnInit() {
        this.params = this._route.snapshot.data;
        console.log(this.params);
        this._pageTitle.set(this._route);
    }

}
