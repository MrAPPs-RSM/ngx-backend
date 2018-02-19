import {FormField} from './form-field';

export interface FormFieldFile extends FormField {
    options: {
        api: {
            upload: string;
            delete?: string;
        },
        multiple?: boolean;
        allowedContentTypes?: string[];
    };
}
