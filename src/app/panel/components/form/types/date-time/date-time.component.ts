import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormFieldDate} from '../../interfaces/form-field-date';

@Component({
    selector: 'app-date-time',
    templateUrl: './date-time.component.html',
    styleUrls: ['./date-time.component.scss']
})
export class DateTimeComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() field: FormFieldDate;

    constructor() {
    }

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
