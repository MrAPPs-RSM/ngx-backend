export interface TableColumns {
    [key: string]: {
        title: string;
        type: string; // text | boolean | email | url | color | image
        width?: string;
        sort?: boolean;
        filter?: any;
    };
}
