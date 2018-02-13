import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-input-number',
    templateUrl: './input-number.component.html',
    styleUrls: ['./input-number.component.scss']
})
export class InputNumberComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() field: any = {};

    public calculatedValue: any = null;

    constructor(private _route: ActivatedRoute) {
    }

    ngOnInit() {
        if (this.field.value) {
            if (this.field.value === ':id') {
                this.calculatedValue = this._route.params['value'].id;
                this.form.controls[this.field.key].setValue(this.calculatedValue);
            } else {
                if (!isNaN(this.field.value)) {
                    this.calculatedValue = this.field.value;
                }
            }
        }
    }

    get isValid() {
        if (this.form.controls[this.field.key].value === null || this.form.controls[this.field.key].value === '') {
            return true;
        } else {
            return this.form.controls[this.field.key].valid;
        }
    }
}
