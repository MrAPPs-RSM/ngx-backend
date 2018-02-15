import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import 'rxjs/add/operator/first';

@Component({
    selector: 'app-input-color',
    templateUrl: './input-color.component.html',
    styleUrls: ['./input-color.component.scss']
})
export class InputColorComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() field: any = {};
    @Input() isEdit: boolean;

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
        if (this.isEdit) {
            this.form.controls[this.field.key].valueChanges
            //.first() // TODO: remove comment
                .subscribe(
                    value => {
                        this.onColorChange(value);
                    }
                );
        } else {
            this.onColorChange(null);
        }
    }

    onColorChange(color: any): void {
        if (color === null) {
            color = '#ffffff';
        }
        this.color = color;
        this.form.controls[this.field.key].setValue(color);
    }

}
