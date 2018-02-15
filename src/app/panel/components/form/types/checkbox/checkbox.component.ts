import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CheckboxComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() field: any = {};
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
