import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {FormFieldDate} from '../../interfaces/form-field-date';
import {UtilsService} from '../../../../../services/utils.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent extends BaseInputComponent implements OnInit, OnDestroy {

    @Input() field: FormFieldDate;

    private _subFieldSubscription = Subscription.EMPTY;

    min: Date;
    max: Date;

    ngOnInit() {
        this.checkDisabled();
        this.initMaxMin();

        if (this.isEdit) {
            if (this.isSubField) {
                this._subFieldSubscription = this.getControl().parent.valueChanges.subscribe((value) => {
                    if (value && value[this.field.key]) {
                        this.setValue(value[this.field.key], {emitEvent: false});
                        this._subFieldSubscription.unsubscribe();
                    }
                });
            } else {
                this.getControl().valueChanges.first().subscribe((value) => {
                    this.setValue(value);
                });
            }
        } else {
            if (this.field.value) {
                this.getControl().setValue(UtilsService.getDateObjectFromString(this.field.value));
            }
        }
    }

    setValue(value: any, options?: {emitEvent: boolean}) {
        if (value) {
            this.getControl().setValue(new Date(value), options);
        } else {
            this.clearValue(options);
        }
    }

    clearValue(options?: {emitEvent: boolean}) {
        this.getControl().setValue(null, options);
    }

    private initMaxMin() {
        if (this.field.min) {
            this.min = UtilsService.getDateObjectFromString(this.field.min);
        }
        if (this.field.max) {
            this.max = UtilsService.getDateObjectFromString(this.field.max);
        }
    }

    ngOnDestroy() {
        if (this._subFieldSubscription) {
            this._subFieldSubscription.unsubscribe();
        }
    }
}
