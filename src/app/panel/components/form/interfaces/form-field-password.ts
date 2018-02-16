import {FormField} from './form-field';

export interface FormFieldPassword extends FormField {
    confirm?: FormFieldPasswordConfirm;
}

interface FormFieldPasswordConfirm extends FormField {
    errorMessage?: string;
}

