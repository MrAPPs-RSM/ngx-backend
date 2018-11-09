export interface FormField {
    type: string;
    label: string;
    key?: string;
    hidden?: boolean;
    visibleOn?: any;
    calculatedValue?: string;
    disabled?: boolean;
    placeholder?: string;
    value?: any;
    class?: string;
    description?: string;
    dependsOn?: any[];
    validators?: {
        required?: boolean,
        minLength?: number,
        maxLength?: number,
        pattern?: string,
        min?: number,
        max?: number
    };
}
