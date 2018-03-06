import {Component, Input, OnInit} from '@angular/core';
import {FormFieldDate} from '../../interfaces/form-field-date';
import {BaseInputComponent} from '../base-input/base-input.component';
import {NguiDatetime} from '@ngui/datetime-picker';

@Component({
    selector: 'app-date-time',
    templateUrl: './date-time.component.html',
    styleUrls: ['./date-time.component.scss']
})
export class DateTimeComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormFieldDate;

    ngOnInit() {
        this.form.controls[this.field.key].valueChanges
            .subscribe(value => {
                if (value && !isNaN(value)) {
                    this.form.controls[this.field.key].setValue(
                        NguiDatetime.formatDate(new Date(value))
                    );
                }
            });
    }

    get isValid() {
        if (this.getControl().touched) {
            if (!isNaN(Date.parse(this.form.controls[this.field.key].value))) {
                return this.form.controls[this.field.key].valid;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
}
