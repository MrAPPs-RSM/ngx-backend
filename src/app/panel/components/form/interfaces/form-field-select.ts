import {FormField} from './form-field';

export interface FormFieldSelect extends FormField {
    options: any;
    multiple?: boolean;
    dependsOn?: any; // if options of the select depends on a field of the current form
}
