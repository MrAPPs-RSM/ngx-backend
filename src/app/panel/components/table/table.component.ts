import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {TableSettings} from './interfaces/table-settings';
import {ApiService} from '../../../api/api.service';
import {TableFilter} from '../../modules/ng2-smart-table/lib/data-filters/table-filter';
import {TableSort} from '../../modules/ng2-smart-table/lib/data-filters/table-sort';
import {TablePagination} from '../../modules/ng2-smart-table/lib/data-filters/table-pagination';
import {TableSelection} from '../../modules/ng2-smart-table/lib/data-filters/table-selection';
import {TableActiveFilters} from '../../modules/ng2-smart-table/lib/data-filters/table-active-filters';
import {HttpErrorResponse} from '@angular/common/http';
import {TableAction} from './interfaces/table-action';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {isNullOrUndefined} from 'util';
import * as _ from 'lodash';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnInit {

    @Input() settings: TableSettings;

    private DEFAULTS = {
        pager: {
            perPage: 10
        },
        drag: {
            sortField: 'weight'
        }
    };

    private isLoading: boolean = false;

    public data: any[];
    public activeFilters: TableActiveFilters = {};
    public count: number;

    private filter: TableFilter;
    private sort: TableSort;
    private pagination: TablePagination;

    constructor(private _apiService: ApiService,
                private _router: Router,
                private _toast: ToastrService) {
    }

    ngOnInit() {
        this.activeFilters.sort = [];
        this.activeFilters.pagination = {
            page: 1,
            perPage: this.settings.pager && this.settings.pager.perPage ? this.settings.pager.perPage : this.DEFAULTS.pager.perPage,
        };
        this.getData();
    }

    private getData(): void {
        this.isLoading = true;

        this.getCount()
            .then((res: { count: number }) => {
                this.count = res.count;
                this._apiService.get(this.settings.api.endpoint, this.composeParams(this.filter, this.sort, this.pagination))
                    .then((data) => {
                        this.isLoading = false;
                        this.data = data;
                    })
                    .catch((response: HttpErrorResponse) => {
                        this.isLoading = false;
                        console.log(response.error);
                    });
            })
            .catch((response: HttpErrorResponse) => {
                console.log(response.error);
            });
    }

    private getCount(): Promise<any> {
        return this._apiService.get(this.settings.api.endpoint + '/count', this.composeCountParams(this.filter));
    }

    private composeParams(filter?: TableFilter, sort?: TableSort, pagination?: TablePagination): Object {
        const params = {
            where: {
                and: []
            },
            order: null,
            skip: 0,
            limit: this.settings.pager && this.settings.pager.perPage ? this.settings.pager.perPage : this.DEFAULTS.pager.perPage,
        };

        /** Pagination */
        if (pagination) {
            params.limit = pagination.perPage;
            params.skip = (pagination.page - 1) * params.limit;
        }

        /** Sort (if drag enabled, always sort by weight ascending) */
        if (this.settings.drag) {
            params.order = this.settings.drag.sortField ? this.settings.drag.sortField : this.DEFAULTS.drag.sortField;
            params.order += ' ASC';
        } else {
            if (sort) {
                params.order = sort.field + ' ' + sort.direction.toUpperCase();
            }
        }

        /** Filters */
        if (!_.isEmpty(filter) && !isNullOrUndefined(filter)) {
            Object.keys(filter).forEach((key) => {
                const condition = {};
                if (this.settings.columns[key].type === 'boolean') {
                    condition[key] = filter[key];
                } else {
                    condition[key] = {
                        like: '%' + filter[key] + '%'
                    };
                }
                params.where.and.push(condition);
            });

            params.skip = 0; // reset pagination if filters
        }

        return {
            filter: JSON.stringify(params)
        };
    }

    private composeCountParams(filter?: TableFilter): Object {
        const params = {
            where: {
                and: []
            }
        };

        /** Filters */
        if (filter) {
            Object.keys(filter).forEach((key) => {
                const condition = {};
                if (this.settings.columns[key].type === 'boolean') {
                    condition[key] = filter[key];
                } else {
                    condition[key] = {
                        like: '%' + filter[key] + '%'
                    };
                }
                params.where.and.push(condition);
            });
        }

        return {
            where: JSON.stringify(params.where)
        };
    }

    private parseAction(action: TableAction, data?: any): void {
        if (action.config.path) {
            if (!data) {
                this._router.navigate(['panel/' + action.config.path]);
            } else {
                let path = action.config.path;
                if (path.indexOf(':id') !== -1) {
                    path = path.replace(':id', data.id);
                }
                if (path.indexOf(':title') !== -1 && action.config.titleField) {
                    path = path.replace(':title', data[action.config.titleField]);
                }
                this._router.navigate(['panel/' + path]);
            }
        }

        if (action.config.endpoint) {
            let endpoint = action.config.endpoint;
            if (endpoint.indexOf(':id') !== -1) {
                endpoint = endpoint.replace(':id', data.id);
            }

            if (action.config.method) {
                switch (action.config.method) {
                    case 'post': {
                        if (action.config.body) {} // TODO: future support if necessary
                    } break;
                    case 'put': {
                        if (action.config.body) {} // TODO: future support if necessary
                    } break;
                    case 'patch': {
                        if (action.config.body) {} // TODO: future support if necessary
                    } break;
                    case 'delete': {
                        this._apiService.delete(endpoint)
                            .then((response) => {
                                this._toast.success('message', 'Success');
                            })
                            .catch((response: HttpErrorResponse) => {
                                this._toast.error(response.error);
                            });
                    } break;
                }
            }
        }

        if (action.config.refreshAfter !== false) {
            this.getData();
        }
    }

    onAction(event: { action: TableAction, data: any }) {
        this.parseAction(event.action, event.data);
    }

    onCreate() {
        this.parseAction(this.settings.actions.add);
    }

    onRowSelect(event: TableSelection) {
        console.log('ON Select row(s)');
        console.log(event);
    }

    onFilter(filter: TableFilter) {
        this.filter = filter;
        this.getData();
        this.activeFilters.filter = this.filter;
    }

    onPagination(pagination: TablePagination) {
        this.pagination = pagination;
        this.getData();
        this.activeFilters.pagination = this.pagination;
    }

    onSort(sort: TableSort) {
        this.sort = sort;
        this.getData();
        this.activeFilters.sort = [];
        this.activeFilters.sort.push(this.sort);
    }
}
