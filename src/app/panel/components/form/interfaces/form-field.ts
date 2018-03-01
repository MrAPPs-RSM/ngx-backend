export interface FormField {
    type: string;
    multiLang: boolean;
    label: string;
    key?: string;
    hidden?: boolean;
    disabled?: string;
    placeholder?: string;
    value?: any;
    class?: string;
    description?: string;
    validators?: {
        required?: boolean,
        minLength?: number,
        maxLength?: number,
        pattern?: string,
        min?: number,
        max?: number
    };
}
