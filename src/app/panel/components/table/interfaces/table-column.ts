export interface TableColumn {
    [key: string]: {
        title: string;
        type: string;
        width?: string;
        sort?: boolean;
        filter?: any;
    };
}
