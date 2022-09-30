import {FormField} from './form-field';

export interface FormFieldSelect extends FormField {
    options?: any;
    search?: {
        endpoint: string;
    };
    useContextId?: boolean;
    multiple?: boolean;
    lang?: boolean; // if lang needed
    dependsOn?: any; // if options of the select depends on a field of the current form
}
