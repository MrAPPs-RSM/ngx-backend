import {Component, Input, OnInit} from '@angular/core';
import {FormFieldCheckbox} from '../../interfaces/form-field-checkbox';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormFieldCheckbox;

    ngOnInit() {
        if (!this.isEdit) {
            this.getControl().patchValue(this.field.checked);
        }
    }

    get isValid() {
        return this.getControl().valid;
    }
}
