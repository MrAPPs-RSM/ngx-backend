import {Component, Input, OnInit} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {FormFieldDate} from '../../interfaces/form-field-date';
import {UtilsService} from '../../../../../services/utils.service';

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormFieldDate;

    min: Date;
    max: Date;

    ngOnInit() {
        this.checkDisabled();
        this.initMaxMin();

        if (this.isEdit) {
            this.getControl().valueChanges.first().subscribe((value) => {
                if (value) {
                    this.getControl().setValue(new Date(value));
                } else {
                    this.clearValue();
                }
            });
        } else {
            if (this.field.value) {
                this.getControl().setValue(UtilsService.getDateObjectFromString(this.field.value));
            }
        }
    }

    clearValue() {
        this.getControl().setValue(null);
    }

    private initMaxMin() {
        if (this.field.min) {
            this.min = UtilsService.getDateObjectFromString(this.field.min);
        }
        if (this.field.max) {
            this.max = UtilsService.getDateObjectFromString(this.field.max);
        }
    }
}
