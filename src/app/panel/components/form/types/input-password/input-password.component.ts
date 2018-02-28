import {Component, Input, OnInit} from '@angular/core';
import {FormFieldPassword} from '../../interfaces/form-field-password';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
    selector: 'app-input-password',
    templateUrl: './input-password.component.html',
    styleUrls: ['./input-password.component.scss']
})
export class InputPasswordComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormFieldPassword;

    ngOnInit() {
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
