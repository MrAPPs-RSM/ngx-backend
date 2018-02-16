import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormField} from '../../interfaces/form-field';

@Component({
    selector: 'app-input-url',
    templateUrl: './input-url.component.html',
    styleUrls: ['./input-url.component.scss']
})
export class InputUrlComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() field: FormField;

    constructor() {
    }

    ngOnInit() {
    }

    get isValid() {
        if (this.form.controls[this.field.key].value === null || this.form.controls[this.field.key].value === '') {
            return true;
        } else {
            return this.form.controls[this.field.key].valid;
        }
    }

}
