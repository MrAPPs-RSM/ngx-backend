import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-base-input',
  templateUrl: './base-input.component.html',
  styleUrls: ['./base-input.component.scss']
})
export class BaseInputComponent implements OnInit {

    @Input() index: number;
    @Input() groupName: string;
    @Input() form: FormGroup;
    @Input() field: any = {};
    @Input() isEdit = false;

    constructor() {
    }

    ngOnInit() {
    }

    public getControl(): AbstractControl {
        return this.form.get(this.field.key);
    }

    get isValid() {
        if (this.getControl().value === null || this.getControl().value === '') {
            return true;
        } else {
            return this.getControl().valid;
        }
    }

}
