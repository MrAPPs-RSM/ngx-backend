import {Component, Input, OnInit} from '@angular/core';
import {FormFieldDate} from '../../interfaces/form-field-date';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
    selector: 'app-date-time',
    templateUrl: './date-time.component.html',
    styleUrls: ['./date-time.component.scss']
})
export class DateTimeComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormFieldDate;

    ngOnInit() {
    }

    get isValid() {
        if (this.form.controls[this.field.key].value === null || this.form.controls[this.field.key].value === '') {
            return true;
        } else {
            if (!isNaN(Date.parse(this.form.controls[this.field.key].value))) {
                return this.form.controls[this.field.key].valid;
            } else {
                return false;
            }
        }
    }
}
