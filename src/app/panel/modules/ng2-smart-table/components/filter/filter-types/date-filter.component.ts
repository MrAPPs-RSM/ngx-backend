import {Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';

import {DefaultFilter} from './default-filter';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'date-filter',
    template: `
        <input
                class="form-control"
                (keydown)="false"
                [formControl]="inputControl"
                [owlDateTimeTrigger]="dt"
                [owlDateTime]="dt"
                [selectMode]="'range'"
        >
        <owl-date-time
                #dt
                [firstDayOfWeek]="1"
        ></owl-date-time>
    `
})
export class DateFilterComponent extends DefaultFilter implements OnInit {

    inputControl = new FormControl();
    delay = 0;

    ngOnInit() {
        this.changesSubscription = (this.inputControl.valueChanges as any)
            .debounceTime(this.delay)
            .subscribe((value: boolean) => {
                this.query = {from: value[0], to: value[1]};
                this.setFilter();
            });
    }
}
