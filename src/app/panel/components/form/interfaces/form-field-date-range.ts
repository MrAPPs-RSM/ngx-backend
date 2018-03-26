import {FormField} from './form-field';

export interface FormFieldDateRange extends FormField {
    isDateTime?: boolean;
    fromKey: string;
    toKey: string;
}
