import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {FormFieldDateRange} from '../../interfaces/form-field-date-range';
import {UtilsService} from '../../../../../services/utils.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-date-range-picker',
    templateUrl: './date-range-picker.component.html',
    styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent extends BaseInputComponent implements OnInit, OnDestroy {

    @Input() field: FormFieldDateRange;

    min: Date;
    max: Date;

    private _fromSubscription: Subscription = Subscription.EMPTY;
    private _toSubscription: Subscription = Subscription.EMPTY;

    ngOnInit() {
        this.checkDisabled();
        this.initMaxMin();

        this._fromSubscription = this.getControl(this.field.fromKey).valueChanges.first().subscribe((fromValue) => {
            if (fromValue) {
                this._toSubscription = this.getControl(this.field.toKey).valueChanges.first().subscribe((toValue) => {
                    if (toValue) {
                        this.getControl().setValue([new Date(fromValue), new Date(toValue)]);
                        this._toSubscription.unsubscribe();
                    }
                });
                this._fromSubscription.unsubscribe();
            }
        });

        this.getControl().valueChanges.subscribe((value) => {
            this.updateFormValue(value);
        });
    }

    ngOnDestroy() {
        if (this._fromSubscription) {
            this._fromSubscription.unsubscribe();
        }
        if (this._toSubscription) {
            this._toSubscription.unsubscribe();
        }
    }

    isValid() {
        // TODO
        return true;
    }

    allowClear(): boolean {
        return this.getControl(this.field.fromKey).value !== null
        && this.getControl(this.field.toKey).value !== null && !this.onlyView && !this.field.disabled;
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
