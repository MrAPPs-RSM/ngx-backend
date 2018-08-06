import {FormField} from './form-field';

export interface FormFieldHotspot extends FormField {
    fields: FormField[];
    saveEndpoint?: string;
}
