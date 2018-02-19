export interface FormConfiguration {
    api: {
        endpoint: string,
        filter?: string;
    };
    fields: any[];
    isEdit?: boolean;
    submit?: any;
    confirm?: boolean;
    isLoginForm?: boolean;
    messages?: any;
    class?: string;
    title?: string;
}
