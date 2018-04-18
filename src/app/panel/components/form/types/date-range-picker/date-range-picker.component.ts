import {Component, Input, OnInit} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {FormFieldDateRange} from '../../interfaces/form-field-date-range';
import {UtilsService} from '../../../../../services/utils.service';

@Component({
    selector: 'app-date-range-picker',
    templateUrl: './date-range-picker.component.html',
    styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormFieldDateRange;

    min: Date;
    max: Date;

    ngOnInit() {
        this.checkDisabled();
        this.initMaxMin();

        if (this.isEdit) {
            this.getControl(this.field.fromKey).valueChanges.first().subscribe((fromValue) => {
                if (fromValue) {
                    this.getControl(this.field.toKey).valueChanges.first().subscribe((toValue) => {
                        if (toValue) {
                            this.getControl().setValue([new Date(fromValue), new Date(toValue)]);
                        }
                    });
                }
            });
        }

        this.getControl().valueChanges.subscribe((value) => {
            this.updateFormValue(value);
        });
    }

    isValid() {
        // TODO
        return true;
    }

    allowClear(): boolean {
        return this.getControl(this.field.fromKey).value !== null
        && this.getControl(this.field.toKey).value !== null;
    }

    clearValue() {
        this.getControl().setValue([null, null]);
    }

    private initMaxMin() {
        if (this.field.min) {
            this.min = UtilsService.getDateObjectFromString(this.field.min);
        }
        if (this.field.max) {
            this.max = UtilsService.getDateObjectFromString(this.field.max);
        }
    }

    private updateFormValue(value: any[]) {
        this.getControl(this.field.fromKey).setValue(value[0]);
        this.getControl(this.field.toKey).setValue(value[1]);
    }
}
