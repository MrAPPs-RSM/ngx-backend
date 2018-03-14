import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormField} from '../../interfaces/form-field';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
    selector: 'app-input-number',
    templateUrl: './input-number.component.html',
    styleUrls: ['./input-number.component.scss']
})
export class InputNumberComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormField;

    public calculatedValue: number = null;

    constructor(private _route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
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
}
