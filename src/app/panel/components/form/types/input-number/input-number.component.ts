import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormField} from '../../interfaces/form-field';
import {BaseInputComponent} from '../base-input/base-input.component';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-input-number',
    templateUrl: './input-number.component.html',
    styleUrls: ['./input-number.component.scss']
})
export class InputNumberComponent extends BaseInputComponent implements OnInit, OnDestroy {

    @Input() field: FormField;

    public calculatedValue: number = null;
    private _subFieldSubscription = Subscription.EMPTY;

    constructor(private _route: ActivatedRoute) {
        super();
    }

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

        if (this.field.value) {
            if (this.field.value === ':id') {
                this.calculatedValue = this._route.params['value'].id;
                this.getControl().setValue(this.calculatedValue);
            } else {
                if (!isNaN(this.field.value)) {
                    this.calculatedValue = this.field.value;
                }
            }
        }
    }

    ngOnDestroy() {
        if (this._subFieldSubscription) {
            this._subFieldSubscription.unsubscribe();
        }
    }
}
