import {FormField} from './form-field';

export interface FormFieldTextarea extends FormField {
    options?: {
        tinyMce?: {
            init?: any; // init config of tinymce https://www.tinymce.com/docs/plugins/
        },
        rows?: number,
        cols?: number
    };
}
