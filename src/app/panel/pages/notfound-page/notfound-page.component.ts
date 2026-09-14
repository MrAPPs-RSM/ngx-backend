import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';

@Component({
    selector: 'app-notfound-page',
    templateUrl: './notfound-page.component.html',
    styleUrls: ['./notfound-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NotfoundPageComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }
}
