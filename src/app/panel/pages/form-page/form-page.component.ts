import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PageTitleService} from '../../services/page-title.service';

@Component({
    selector: 'app-form-page',
    templateUrl: './form-page.component.html',
    styleUrls: ['./form-page.component.scss']
})
export class FormPageComponent implements OnInit {

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