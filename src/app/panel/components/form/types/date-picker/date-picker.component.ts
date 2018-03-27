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
        }
    }

    clear() {
        this.getControl().setValue(null);
    }
}
