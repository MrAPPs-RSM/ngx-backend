import {FormButton} from './form-button';

export interface FormSettings {
    api: {
        endpoint: string,
        filter?: string;
    };
    fields: any;
    isEdit?: boolean;
    submit?: {
        label?: string; // if not set: "Save"
        confirm?: boolean; // if true, show modal to confirm
        refreshAfter?: boolean; // default = false, determines what to do after submit
        redirectAfter?: string; // if set, redirect to a path after submit
    };
    buttons?: FormButton[];
    responseType?: string; // 'default' | 'inline' | 'terminal' | 'alert' TODO
    messages?: any;
    class?: string;
    title?: string;
    errors?: any[];
}
