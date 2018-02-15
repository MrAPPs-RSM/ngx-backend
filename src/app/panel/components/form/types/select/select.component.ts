import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SelectComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() field: any = {};
    @Input() isEdit: boolean;

    public options: SelectData[] = [
        {
            id: 1,
            text: 'One'
        },
        {
            id: 2,
            text: 'Two'
        },
        {
            id: 3,
            text: 'Three'
        }
    ];

    constructor() {
    }

    ngOnInit() {
    }

    get isValid() {
        if (this.field.validators && this.field.validators.required) {
            if (this.field.multiple) {
                if (this.form.controls[this.field.key].value instanceof Array) {
                    return this.form.controls[this.field.key].value.length > 0;
                } else {
                    return this.form.controls[this.field.key].value !== null;
                }
            } else {
                return this.form.controls[this.field.key].value !== null;
            }
        } else {
            return true;
        }
    }

}

export interface SelectData {
    id: string | number;
    text: string;
}
