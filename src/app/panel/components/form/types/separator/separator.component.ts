import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'app-separator',
    templateUrl: './separator.component.html',
    styleUrls: ['./separator.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SeparatorComponent implements OnInit {

    @Input() field: any = {};

    constructor() {
    }

    ngOnInit() {
    }

}
