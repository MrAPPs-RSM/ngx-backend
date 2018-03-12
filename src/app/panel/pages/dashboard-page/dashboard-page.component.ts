import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'app-dashboard-page',
    templateUrl: './dashboard-page.component.html',
    styleUrls: ['./dashboard-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardPageComponent implements OnInit {

    private params: any = {}; // Setup params

    constructor() {
    }

    ngOnInit() {

    }
}
