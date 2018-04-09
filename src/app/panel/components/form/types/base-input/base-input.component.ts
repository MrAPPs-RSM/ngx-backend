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
    @Input() onlyView = false;
    @Input() isSubField: boolean;

    constructor() {
    }

    ngOnInit() {
    }

    public checkDisabled(): void {
        if (this.field.disabled || this.onlyView) {
            this.getControl().disable();
        }
    }

    public isRequired(key?: string): boolean {
        if (key) {
            return this.field[key].validators && this.field[key].validators.required;
        } else {
            return this.field.validators && this.field.validators.required;
        }
    }

    public getControl(key?: string): AbstractControl {
        if (key) {
            return this.form.get(key);
        } else {
            return this.form.get(this.field.key);
        }
    }

    public isValid(key?: string): boolean {
        if (this.getControl(key).touched) {
            return this.getControl(key).valid;
        } else {
            return true;
        }
    }
}
