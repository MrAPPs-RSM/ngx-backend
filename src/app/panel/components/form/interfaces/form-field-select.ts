import {FormField} from './form-field';

export interface FormFieldSelect extends FormField {
    options: any;
    multiple?: boolean;
}
