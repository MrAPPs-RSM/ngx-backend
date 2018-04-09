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

    ngOnInit() {
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
    }

    ngOnDestroy() {
        if (this._calcValueSub) {
            this._calcValueSub.unsubscribe();
        }
    }
}
