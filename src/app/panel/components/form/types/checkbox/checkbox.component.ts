import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {FormFieldCheckbox} from '../../interfaces/form-field-checkbox';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CheckboxComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormFieldCheckbox;

    ngOnInit() {
        if (!this.isEdit) {
            this.getControl().patchValue(this.field.checked);
        }
    }

    isValid() {
        return this.getControl().valid;
    }
}
