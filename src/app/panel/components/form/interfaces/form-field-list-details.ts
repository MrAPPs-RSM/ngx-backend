import {FormField} from './form-field';

export interface FormFieldListDetails extends FormField {
    fields: FormField[];
    drag?: boolean;
    unique?: boolean;
    max?: number;
}
