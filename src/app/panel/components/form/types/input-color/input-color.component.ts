import {Component, Input, OnInit} from '@angular/core';
import 'rxjs/add/operator/first';
import {FormField} from '../../interfaces/form-field';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
    selector: 'app-input-color',
    templateUrl: './input-color.component.html',
    styleUrls: ['./input-color.component.scss']
})
export class InputColorComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormField;

    color: any = null;

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
