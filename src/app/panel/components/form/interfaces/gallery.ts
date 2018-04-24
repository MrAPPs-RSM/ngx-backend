export interface Gallery {
    class?: string;
    hidden?: boolean;
    label?: string;
    description?: string;
    options: {
        endpoint: string;
        download?: boolean;
    };
}
