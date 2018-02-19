import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import 'rxjs/add/operator/first';
import {FormField} from '../../interfaces/form-field';

@Component({
    selector: 'app-input-color',
    templateUrl: './input-color.component.html',
    styleUrls: ['./input-color.component.scss']
})
export class InputColorComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() field: FormField;

    color: any = null;

    constructor() {
    }

    get isValid() {
        if (this.form.controls[this.field.key].value === null || this.form.controls[this.field.key].value === '') {
            return true;
        } else {
            return this.form.controls[this.field.key].valid;
        }
    }

    ngOnInit() {
        this.onColorChange(null);
        this.form.controls[this.field.key].valueChanges
            .first()
            .subscribe(
                value => {
                    this.onColorChange(value);
                }
            );
    }

    onColorChange(color: any): void {
        if (color === null) {
            color = '#ffffff';
        }
        this.color = color;
        this.form.controls[this.field.key].setValue(color);
    }

}
