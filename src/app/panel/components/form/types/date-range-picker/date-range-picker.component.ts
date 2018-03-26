import {Component, Input, OnInit} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {FormFieldDateRange} from '../../interfaces/form-field-date-range';
import {AbstractControl} from '@angular/forms';

@Component({
    selector: 'app-date-range-picker',
    templateUrl: './date-range-picker.component.html',
    styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormFieldDateRange;

    ngOnInit() {
        if (this.isEdit) {
            this.getControlByKey(this.field.fromKey).valueChanges.first().subscribe((fromValue) => {
                if (fromValue) {
                    this.getControlByKey(this.field.toKey).valueChanges.first().subscribe((toValue) => {
                        if (toValue) {
                            this.getControl().setValue([new Date(fromValue), new Date(toValue)]);
                        }
                    });
                }
            });
        }

        this.getControl().valueChanges.subscribe((value) => {
            this.setFormValue(value);
        });
    }

    getControlByKey(key: string): AbstractControl {
        return this.form.get(key);
    }

    get isValid() {
        return true;
    }

    private setFormValue(value: any[]) {
        this.getControlByKey(this.field.fromKey).setValue(value[0]);
        this.getControlByKey(this.field.toKey).setValue(value[1]);
    }
}
