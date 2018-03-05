export interface TableColumns {
    [key: string]: {
        title: string;
        type: string; // text | boolean | email | url | color | image
        hidden?: boolean; // if true, column not visible
        width?: string;
        sort?: boolean;
        filter?: any;
    };
}
