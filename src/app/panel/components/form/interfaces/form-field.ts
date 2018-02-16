export interface FormField {
    type: string;
    label: string;
    key?: string;
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
