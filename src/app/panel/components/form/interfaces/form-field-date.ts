import {FormField} from './form-field';

export interface FormFieldDate extends FormField {
    isDateTime?: boolean;
    enableSeconds?: boolean;
    min?: string;
    max?: string;
}
