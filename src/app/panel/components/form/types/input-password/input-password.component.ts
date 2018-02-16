import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormFieldPassword} from '../../interfaces/form-field-password';

@Component({
    selector: 'app-input-password',
    templateUrl: './input-password.component.html',
    styleUrls: ['./input-password.component.scss']
})
export class InputPasswordComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() field: FormFieldPassword;

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

    // TODO: do password match logic

    get passwordMatch() {
        /*if (this.field.hasOwnProperty('confirm')) {
            let password = this.form.controls[this.field.key].value;
            let confirmPassword = this.form.controls[this.field.confirm.key].value;
            if (!isNullOrUndefined(password) && password !== '') {
                return password === confirmPassword;
            } else {
                return false;
            }
        } else {
            return false;
        }*/
        return false;
    }

    get showPasswordError() {
        /*if (this.field.hasOwnProperty('confirm')) {
            const password = this.form.controls[this.field.key].value;
            const confirmPassword = this.form.controls[this.field.confirm.key].value;
            return !this.passwordMatch &&
                ((!isNullOrUndefined(password) && password !== '')
                || (!isNullOrUndefined(confirmPassword) && confirmPassword !== ''));
        }*/
        return true;
    }

}
