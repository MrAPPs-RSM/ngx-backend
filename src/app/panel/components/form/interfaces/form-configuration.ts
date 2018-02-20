import {FormField} from './form-field';

export interface FormConfiguration {
    api: {
        endpoint: string,
        filter?: string;
    };
    fields: FormField[];
    isEdit?: boolean;
    submit?: any;
    confirm?: boolean;
    isLoginForm?: boolean;
    messages?: any;
    class?: string;
    title?: string;
}
