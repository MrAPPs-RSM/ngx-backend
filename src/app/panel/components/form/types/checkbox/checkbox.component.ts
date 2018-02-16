import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormFieldCheckbox} from '../../interfaces/form-field-checkbox';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() field: FormFieldCheckbox;
    @Input() isEdit: boolean;

    constructor() {
    }

    ngOnInit() {
        if (!this.isEdit) {
            this.form.controls[this.field.key].patchValue(this.field.checked);
        }
    }

    get isValid() {
        return this.form.controls[this.field.key].valid;
    }
}
