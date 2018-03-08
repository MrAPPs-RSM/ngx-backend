import {FormField} from './form-field';
import {isNullOrUndefined} from 'util';

export interface FormFieldFile extends FormField {
    options: {
        api: {
            upload: string;
        },
        maxFiles?: number; // only if multiple
        multiple?: boolean;
        allowedContentTypes?: string[];
    };
}

export interface UploadedFile {
    id: number;
    url?: string;
    type: string;
}

