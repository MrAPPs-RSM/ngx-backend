import {TableAction} from './table-action';
import {TableColumns} from './table-column';

export interface TableSettings {
    title?: string;
    api: {
        endpoint: string;
        sortEndpoint?: string;
    };
    drag?: {
        sortField?: string;
    };
    noDataLabel?: string;
    messages?: any;
    actions?: {
        columnTitle?: string;
        add?: TableAction,
        list?: TableAction[];
    };
    columns: TableColumns;
    pager?: {
        perPage?: number;
    };
}
