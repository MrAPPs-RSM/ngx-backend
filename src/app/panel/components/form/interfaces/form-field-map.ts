import {FormField} from './form-field';

export interface FormFieldMap extends FormField {
    lng: FormField;
    lat: FormField;
    defaults?: {
        lat?: number;
        lng?: number;
    };
}
