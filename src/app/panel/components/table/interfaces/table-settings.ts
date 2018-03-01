import {TableAction} from './table-action';
import {TableColumns} from './table-column';

export interface TableSettings {
    title?: string;
    api: {
        endpoint: string;
    };
    drag?: {
        sortField?: string; // if not defined, will be weight
        endpoint?: string; // if not defined, will be "endpoint/sort"
        method?: string; // if not defined, will be PATCH
    };
    noDataLabel?: string;
    messages?: any; // TODO
    generalActions?: TableAction[]; // General actions (export csv...)
    actions?: {
        columnTitle?: string;
        add?: TableAction,
        list?: TableAction[];
    };
    columns: TableColumns;
    selectMode?: string; // multi || single
    pager?: {
        perPage?: number;
    };
}
