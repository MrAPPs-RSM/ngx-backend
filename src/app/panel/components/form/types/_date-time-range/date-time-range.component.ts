import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormFieldDateRange} from '../../interfaces/form-field-date-range';
import {BaseInputComponent} from '../base-input/base-input.component';
// import {NguiDatetime} from '@ngui/datetime-picker';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-date-time-range',
    templateUrl: './date-time-range.component.html',
    styleUrls: ['./date-time-range.component.scss']
})
export class DateTimeRangeComponent extends BaseInputComponent implements OnInit, OnDestroy {

    /**
     * TODO: review this component validation logic when it will be used!!!
     */

    @Input() field: FormFieldDateRange;

    private _subscriptionStartDate = Subscription.EMPTY;
    private _subscriptionEndDate = Subscription.EMPTY;

    ngOnInit() {
       this._subscriptionStartDate = this.form.controls[this.field.startDate.key].valueChanges
            .subscribe(value => {
                if (value && !isNaN(value)) {
                    this.form.controls[this.field.startDate.key].setValue(
                        null
                        // NguiDatetime.formatDate(new Date(value))
                    );
                }
            });
       this._subscriptionEndDate = this.form.controls[this.field.endDate.key].valueChanges
            .first()
            .subscribe(value => {
                if (value && !isNaN(value)) {
                    this.form.controls[this.field.endDate.key].setValue(
                        null
                        // NguiDatetime.formatDate(new Date(value))
                    );
                }
            });
    }

    ngOnDestroy() {
        this._subscriptionStartDate.unsubscribe();
        this._subscriptionEndDate.unsubscribe();
    }

    isDateValid(type: string) {
        if (this.form.controls[this.field[type].key].touched) {
            if (!isNaN(Date.parse(this.form.controls[this.field[type].key].value))) {
                this.form.controls[this.field[type].key].setErrors(null);
                return this.form.controls[this.field[type].key].valid;
            } else {
                this.form.controls[this.field[type].key].setErrors({isNotDate: true});
                return false;
            }
        } else {
            return true;
        }
    }

    get isValid() {
        if (this.isDateValid('startDate') && this.isDateValid('endDate')) {
            if (Date.parse(this.form.controls[this.field.startDate.key].value)
                <= Date.parse(this.form.controls[this.field.endDate.key].value)) {
                this.form.controls[this.field.endDate.key].setErrors(null);
                return true;
            } else {
                this.form.controls[this.field.endDate.key].setErrors({invalidRange: true});
                return false;
            }
        } else {
            return false;
        }
    }
}
