import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';

@Component({
    selector: 'app-dashboard-page',
    templateUrl: './dashboard-page.component.html',
    styleUrls: ['./dashboard-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DashboardPageComponent implements OnInit {

    private params: any = {}; // Setup params

    constructor() {
    }

    ngOnInit() {

    }
}
