import {TableAction} from './table-action';
import {TableColumn} from './table-column';

export interface TableSettings {
    title?: string;
    api: {
        endpoint: string;
        sortEndpoint?: string;
    };
    enableDrag?: boolean;
    noDataLabel?: string;
    messages?: any;
    actions?: {
        columnTitle?: string;
        add?: TableAction,
        list?: TableAction[];
    };
    columns: TableColumn[];
    pager?: {
        perPage?: number;
    };
}
