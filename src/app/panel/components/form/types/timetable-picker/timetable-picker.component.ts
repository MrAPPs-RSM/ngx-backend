import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {FormControl, FormGroup} from '@angular/forms';
import {isNullOrUndefined} from 'util';
import {Subscription} from 'rxjs';
import {Time} from "@angular/common";
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-timetable-picker',
    templateUrl: './timetable-picker.component.html',
    styleUrls: ['./timetable-picker.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TimetablePickerComponent extends BaseInputComponent implements OnInit, OnDestroy {

    timeMask = [/[0-2]/, /\d/, ':', /[0-5]/, /\d/]; // hh:mm

    subForm: FormGroup;
    mS: FormControl = new FormControl(); // morning start
    mE: FormControl = new FormControl(); // morning end
    aS: FormControl = new FormControl(); // afternoon start
    aE: FormControl = new FormControl(); // afternoon end

    private _subscription = Subscription.EMPTY;
    private _subFormSubscription = Subscription.EMPTY;
    private _subFieldSubscription = Subscription.EMPTY;

    private static isEvaluated(value: any): boolean {
        return !isNullOrUndefined(value) && value !== '';
    }

    private static isNotEvaluated(value: any): boolean {
        return isNullOrUndefined(value) || value === '';
    }

    ngOnInit() {
        this.subForm = new FormGroup({
            'mS': this.mS,
            'mE': this.mE,
            'aS': this.aS,
            'aE': this.aE
        });

        if (this.isEdit) {

            if (this.getControl().value) {
                this.subForm.patchValue(this.getControl().value);
            }

            if (this.isSubField) {
                this._subFieldSubscription = this.getControl().parent.valueChanges.subscribe((value) => {
                    console.log(value);
                    if (value && value[this.field.key]) {
                        this.subForm.patchValue(value[this.field.key], {emitEvent: false});
                        this._subFieldSubscription.unsubscribe();
                    }
                });
            } else {
                this._subscription = this.getControl().valueChanges.pipe(first()).subscribe((value) => {
                    this.subForm.patchValue(value);
                });
            }
        }

        this.changeListener();
    }

    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }

        if (this._subFormSubscription) {
            this._subFormSubscription.unsubscribe();
        }

        if (this._subFieldSubscription) {
            this._subFieldSubscription.unsubscribe();
        }
    }

    isValid() {
        if (this.isRequired() && this.isDirty()) {
            // Only morning open
            if (TimetablePickerComponent.isEvaluated(this.mS.value) &&
                TimetablePickerComponent.isEvaluated(this.mE.value) &&
                TimetablePickerComponent.isNotEvaluated(this.aS.value) &&
                TimetablePickerComponent.isNotEvaluated(this.aE.value)) {
                return true;
            } else {
                // Only afternoon open
                if (TimetablePickerComponent.isEvaluated(this.aS.value) &&
                    TimetablePickerComponent.isEvaluated(this.aE.value) &&
                    TimetablePickerComponent.isNotEvaluated(this.mS.value) &&
                    TimetablePickerComponent.isNotEvaluated(this.mE.value)) {
                    return true;
                } else {
                    // Full day continue
                    if (TimetablePickerComponent.isEvaluated(this.mS.value) &&
                        TimetablePickerComponent.isEvaluated(this.aE.value) &&
                        TimetablePickerComponent.isNotEvaluated(this.mE.value) &&
                        TimetablePickerComponent.isNotEvaluated(this.aS.value)) {
                        return true;
                    } else {
                        // Full day standard
                        return (TimetablePickerComponent.isEvaluated(this.mS.value) &&
                            TimetablePickerComponent.isEvaluated(this.mE.value) &&
                            TimetablePickerComponent.isEvaluated(this.aS.value) &&
                            TimetablePickerComponent.isEvaluated(this.aE.value));
                    }
                }
            }
        } else {
            return true;
        }
    }

    private isDirty(): boolean {
        return this.mS.dirty || this.mE.dirty || this.aS.dirty || this.aE.dirty;
    }

    private changeListener(): void {
        this._subFormSubscription = this.subForm.valueChanges.subscribe((value) => {
            this.updateControlValue(value);
        });
    }

    private updateControlValue(value: any): void {
        this.getControl().patchValue(value);
    }
}
