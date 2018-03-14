import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import 'rxjs/add/operator/first';
import {FormField} from '../../interfaces/form-field';
import {BaseInputComponent} from '../base-input/base-input.component';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-input-color',
    templateUrl: './input-color.component.html',
    styleUrls: ['./input-color.component.scss']
})
export class InputColorComponent extends BaseInputComponent implements OnInit, OnDestroy {

    @Input() field: FormField;

    color: any = null;

    private _subscription = Subscription.EMPTY;

    ngOnInit() {
        this.onColorChange(null);

        this._subscription = this.getControl().valueChanges
            .first()
            .subscribe(
                value => {
                    this.onColorChange(value);
                }
            );
    }

    ngOnDestroy() {
        if (this._subscription !== null) {
            this._subscription.unsubscribe();
        }
    }

    onColorChange(color: any): void {
        if (color === null) {
            color = '#ffffff';
        }
        this.color = color;
        this.getControl().setValue(color);
    }

}
