import {FormButton} from './form-button';

export interface FormSettings {
    api: {
        endpoint: string,
        filter?: string;
    };
    putTranslationsFirst: boolean;
    fields: any;
    isEdit?: boolean;
    onlyView?: boolean; // does GET but does not allow submit
    submit?: {
        endpoint?: string; // endpoint to call after submit (if different from GET in edit forms)
        label?: string; // if not set: "Save"
        confirm?: boolean; // if true, show modal to confirm
        refreshAfter?: boolean; // default = false, determines what to do after submit
        redirectAfter?: string; // if set, redirect to a path after submit
    };
    buttons?: FormButton[];
    responseType?: string; // 'default' | 'inline' | 'terminal'
    class?: string;
    title?: string;
    errors?: any[];
}
