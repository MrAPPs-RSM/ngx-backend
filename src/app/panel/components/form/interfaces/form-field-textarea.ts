import {FormField} from './form-field';

export interface FormFieldTextarea extends FormField {
    options?: {
        tinyMce?: boolean,
        rows?: number,
        cols?: number
    };
}
