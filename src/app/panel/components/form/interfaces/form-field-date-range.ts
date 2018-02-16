import {FormFieldDate} from './form-field-date';
import {FormField} from './form-field';

export interface FormFieldDateRange extends FormField {
    startDate: FormFieldDate;
    endDate: FormFieldDate;
    errorMessage?: string;
}
