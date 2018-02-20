import {FormField} from './form-field';

export interface FormFieldMap extends FormField {
    lng: FormField;
    lat: FormField;
    options?: {
        defaults?: {
            lat?: number;
            lng?: number;
        };
        marker?: {
            draggable: boolean;
            label?: string;
        }
    };
}