import {FormField} from './form-field';

export interface FormFieldTextarea extends FormField {
    options?: {
        editor?: boolean;
        disable?: string[];
    };
}
