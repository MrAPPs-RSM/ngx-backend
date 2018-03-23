import {Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';

import {DefaultFilter} from './default-filter';

@Component({
    selector: 'date-filter',
    template: `
        <!--<input
                ngui-datetime-picker
                class="form-control date-picker"
                (valueChanged)="onChange($event)"
                [date-only]="false"
        >-->
        DATE FILTER
    `
})
export class DateFilterComponent extends DefaultFilter implements OnInit {

    ngOnInit() {
    }

    onChange(event: any) {
        console.log(event);
    }
}
