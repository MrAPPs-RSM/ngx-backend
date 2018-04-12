import {TableAction} from './table-action';
import {TableColumn} from './table-column';

export interface TableSettings {
    title?: string;
    lang?: boolean;
    api: {
        endpoint: string;
        filter: string;
        countEndpoint?: string; // if different than endpoint/count
    };
    drag?: {
        sortField?: string; // if not defined, will be weight
        endpoint?: string; // if not defined, will be "endpoint/sort"
        method?: string; // if not defined, will be PATCH
    };
    noDataMessage?: string;
    generalActions?: TableAction[]; // General actions (export csv...)
    actions?: {
        columnTitle?: string;
        add?: TableAction,
        list?: TableAction[];
    };
    columns: TableColumn;
    selectMode?: string; // multi || single
    pager?: {
        perPage?: number;
    };
}
