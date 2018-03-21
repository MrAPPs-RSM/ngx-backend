import {FormField} from './form-field';

export interface FormFieldPreview extends FormField {
    fileKey?: any; // file upload field key
    endpoint?: string; // endpoint to call to get preview
}
