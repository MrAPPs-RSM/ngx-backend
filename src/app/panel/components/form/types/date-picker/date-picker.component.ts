import {Component, Input, OnInit} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {FormFieldDate} from '../../interfaces/form-field-date';

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormFieldDate;

    ngOnInit() {
        if (this.isEdit) {
            this.getControl().valueChanges.first().subscribe((value) => {
                this.getControl().setValue(new Date(value));
            });
        } else {
            if (this.field.value) {
                if (this.field.value === 'now') {
                    this.getControl().setValue(new Date());
                } else {
                    const timestamp = Date.parse(this.field.value);
                    if (!isNaN(timestamp)) {
                        this.getControl().setValue(new Date(timestamp));
                    }
                }
            }
        }
    }

    clear() {
        this.getControl().setValue(null);
    }
}
