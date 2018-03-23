import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormFieldDate} from '../../interfaces/form-field-date';
import {BaseInputComponent} from '../base-input/base-input.component';
// import {NguiDatetime} from '@ngui/datetime-picker';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-date-time',
    templateUrl: './date-time.component.html',
    styleUrls: ['./date-time.component.scss']
})
export class DateTimeComponent extends BaseInputComponent implements OnInit, OnDestroy {

    @Input() field: FormFieldDate;

    private _subscription = Subscription.EMPTY;

    ngOnInit() {
        this._subscription = this.getControl().valueChanges
            .subscribe(value => {
                if (value && !isNaN(value)) {
                    this.getControl().setValue(
                        null
                        // NguiDatetime.formatDate(new Date(value))
                    );
                }
            });
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    get isValid() {
        if (this.getControl().touched) {
            if (!isNaN(Date.parse(this.getControl().value))) {
                return this.getControl().valid;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
}
