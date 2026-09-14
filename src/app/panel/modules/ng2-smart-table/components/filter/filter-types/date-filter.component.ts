import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';




import {DefaultFilter} from './default-filter';
import {UntypedFormControl} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'date-filter',
    template: `
        <div class="date-picker-wrapper">
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
            [pickerType]="'calendar'"
          ></owl-date-time>
          @if (inputControl.value) {
            <span class="remove"
            (click)="clear()">×</span>
          }
        </div>
        `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DateFilterComponent extends DefaultFilter implements OnInit {

    @Input() filterValue: any;

    inputControl = new UntypedFormControl();
    delay = 0;

    ngOnInit() {
        this.changesSubscription = (this.inputControl.valueChanges as any)
            .pipe(debounceTime(this.delay))
            .subscribe((value: boolean) => {
                this.query = {from: value[0], to: value[1]};
                this.setFilter();
            });
    }

    clear() {
        this.query = '';
        this.inputControl.setValue(null, {emitEvent: false});
        this.setFilter();
    }
}
