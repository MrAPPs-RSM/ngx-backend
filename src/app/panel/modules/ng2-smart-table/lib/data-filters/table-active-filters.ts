import {TableSort} from './table-sort';
import {TableFilter} from './table-filter';

export interface TableActiveFilters {
    sort?: TableSort[];
    pagination?: {
        perPage: number;
        page: number
    };
    filter?: TableFilter;
}
