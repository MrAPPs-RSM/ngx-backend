import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-input-text',
    templateUrl: './input-text.component.html',
    styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent extends BaseInputComponent implements OnInit, OnDestroy {

    private _calcValueSub: Subscription = Subscription.EMPTY;
    private _subFieldSubscription = Subscription.EMPTY;

    ngOnInit() {
        if (this.isSubField && this.isEdit) {
            this.getControl().updateValueAndValidity();
            this._subFieldSubscription = this.getControl().parent.valueChanges.subscribe((value) => {
                if (value && value[this.field.key]) {
                    this.getControl().patchValue(value[this.field.key], {emitEvent: false});
                    this._subFieldSubscription.unsubscribe();
                }
            });
        }

        if (this.field.calculatedValue) {
            if (this.field.calculatedValue.indexOf('.') > -1) {
                const key = this.field.calculatedValue.split('.')[0];
                const subKey = this.field.calculatedValue.split('.')[1];
                if (this.getControl(key)) {
                    this._calcValueSub = this.getControl(key).valueChanges.subscribe((value) => {
                        if (value && value[subKey]) {
                            this.getControl().setValue(value[subKey]);
                        }
                    });
                }
            }
        }

        if (this.isEdit) {
            if (!this.getControl().value) {
                if (this.field.value !== null && typeof this.field.value !== 'undefined') {
                    this.getControl().setValue(this.field.value);
                }
            }
        }
    }

    ngOnDestroy() {
        if (this._calcValueSub) {
            this._calcValueSub.unsubscribe();
        }
        if (this._subFieldSubscription) {
            this._subFieldSubscription.unsubscribe();
        }
    }
}
