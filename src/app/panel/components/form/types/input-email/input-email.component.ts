import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormField} from '../../interfaces/form-field';
import {BaseInputComponent} from '../base-input/base-input.component';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-input-email',
    templateUrl: './input-email.component.html',
    styleUrls: ['./input-email.component.scss']
})
export class InputEmailComponent extends BaseInputComponent implements OnInit, OnDestroy {
    @Input() field: FormField;

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
    }

    ngOnDestroy() {
        if (this._subFieldSubscription) {
            this._subFieldSubscription.unsubscribe();
        }
    }
}
