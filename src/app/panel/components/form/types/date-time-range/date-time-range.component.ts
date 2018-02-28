import {Component, Input, OnInit} from '@angular/core';
import {FormFieldDateRange} from '../../interfaces/form-field-date-range';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
    selector: 'app-date-time-range',
    templateUrl: './date-time-range.component.html',
    styleUrls: ['./date-time-range.component.scss']
})
export class DateTimeRangeComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormFieldDateRange;

    ngOnInit() {
    }

    isDateValid(type: string) {
        if (this.form.controls[this.field[type].key].value === null || this.form.controls[this.field[type].key].value === '') {
            return true;
        } else {
            if (!isNaN(Date.parse(this.form.controls[this.field[type].key].value))) {
                this.form.controls[this.field[type].key].setErrors(null);
                return this.form.controls[this.field[type].key].valid;
            } else {
                this.form.controls[this.field[type].key].setErrors({isNotDate: true});
                return false;
            }
        }
    }

    get isValid() {
        // TODO: review this code, probably some parts are not necessary after editing FormGenerator
        if (this.isDateValid('startDate') && this.isDateValid('endDate')) {
            if ((this.form.controls[this.field.startDate.key].value !== null
                && this.form.controls[this.field.startDate.key].value !== '')
                && (this.form.controls[this.field.endDate.key].value !== null
                && this.form.controls[this.field.endDate.key].value !== '')) {
                if (Date.parse(this.form.controls[this.field.startDate.key].value)
                    <= Date.parse(this.form.controls[this.field.endDate.key].value)) {
                    this.form.controls[this.field.endDate.key].setErrors(null);
                    return true;
                } else {
                    this.form.controls[this.field.endDate.key].setErrors({invalidRange: true});
                    return false;
                }
            } else {
                this.form.controls[this.field.endDate.key].setErrors(null);
                return true;
            }
        } else {
            return false;
        }
    }
}
