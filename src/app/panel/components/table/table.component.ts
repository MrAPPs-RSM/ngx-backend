import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {TableSettings} from './interfaces/table-settings';
import {ApiService} from '../../../api/api.service';
import {ModalService} from '../../services/modal.service';
import {TableFilter} from '../../modules/ng2-smart-table/lib/data-filters/table-filter';
import {TableSort} from '../../modules/ng2-smart-table/lib/data-filters/table-sort';
import {TablePagination} from '../../modules/ng2-smart-table/lib/data-filters/table-pagination';
import {TableSelection} from '../../modules/ng2-smart-table/lib/data-filters/table-selection';
import {TableActiveFilters} from '../../modules/ng2-smart-table/lib/data-filters/table-active-filters';
import {TableDrop} from '../../modules/ng2-smart-table/lib/data-filters/table-drop';
import {HttpErrorResponse} from '@angular/common/http';
import {TableAction} from './interfaces/table-action';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';
import {UtilsService} from '../../../services/utils.service';
import {StorageService} from '../../../services/storage.service';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnInit {

    /**
     * Mini doc: fixed filter: pass filter without and[], just where: {key:value, key:value...}
     */

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
    public activeFilters: TableActiveFilters = {}; // Need for table, not for API
    public count: number;

    private filter: any = {}; // Need for API, not for table
    private sort: TableSort;
    private pagination: TablePagination;

    constructor(private _apiService: ApiService,
                private _router: Router,
                private _toast: ToastrService,
                private _modal: ModalService,
                private _storageService: StorageService) {
    }

    ngOnInit() {
        this.activeFilters.sort = [];
        this.activeFilters.pagination = {
            page: 1,
            perPage: this.settings.pager && this.settings.pager.perPage ? this.settings.pager.perPage : this.DEFAULTS.pager.perPage,
        };

        /** Read fixed filter from settings if set */
        if (this.settings.api.filter) {
            this.filter = JSON.parse(this.settings.api.filter);
        }

        // Update filters if set from storage service (another components, special buttons..)
        this.readStorageServiceParams();

        this.getData();
    }

    private readStorageServiceParams(): void {
        const tableParameters = this._storageService.getValue('tableParameters');

        if (tableParameters) {
            if (tableParameters.filter) {
                const newFilters = JSON.parse(tableParameters.filter);
                if (newFilters.where) {
                    if (this.filter.where) {
                        // merge objects
                        Object.keys(newFilters.where).forEach((key) => {
                            this.filter.where[key] = newFilters.where[key];
                        });
                    } else {
                        this.filter.where = newFilters.where;
                    }
                }
            }
            this._storageService.clearValue('tableParameters');
        }
    }

    private getData(): void {
        this.isLoading = true;

        this.getCount()
            .then((res: { count: number }) => {
                this.count = res.count;
                this._apiService.get(this.settings.api.endpoint, this.composeParams())
                    .then((data) => {
                        this.isLoading = false;
                        this.data = data;
                    })
                    .catch((response: HttpErrorResponse) => {
                        this.isLoading = false;
                        console.log(response.message);
                    });
            })
            .catch((response: HttpErrorResponse) => {
                console.log(response.message);
            });
    }

    private getCount(): Promise<any> {
        return this._apiService.get(this.settings.api.endpoint + '/count', this.composeCountParams());
    }

    private composeParams(): Object {
        const params = {
            where: {
                and: []
            },
            order: null,
            skip: 0,
            limit: this.settings.pager && this.settings.pager.perPage ? this.settings.pager.perPage : this.DEFAULTS.pager.perPage,
        };

        /** Pagination */
        if (this.pagination) {
            params.limit = this.pagination.perPage;
            params.skip = (this.pagination.page - 1) * params.limit;
        }

        /** Sort (if drag enabled, always sort by weight ascending) */
        if (this.settings.drag) {
            params.order = this.settings.drag.sortField ? this.settings.drag.sortField : this.DEFAULTS.drag.sortField;
            params.order += ' ASC';
        } else {
            if (this.sort) {
                params.order = this.sort.field + ' ' + this.sort.direction.toUpperCase();
            }
        }

        /** Filters */
        if (this.filter) {

            if (this.filter.where) {
                Object.keys(this.filter.where).forEach((key) => {
                    const condition = {};
                    if (this.settings.columns[key]) {
                        if (this.settings.columns[key].type === 'boolean') {
                            condition[key] = this.filter.where[key];
                        } else {
                            condition[key] = {
                                like: '%' + this.filter.where[key] + '%'
                            };
                        }
                    } else {
                        condition[key] = this.filter.where[key];
                    }
                    params.where.and.push(condition);
                });

                params.skip = 0; // reset pagination if filters
            }

            if (this.filter.include) {
                params['include'] = this.filter.include;
            }
        }

        return {
            filter: JSON.stringify(params)
        };
    }

    private composeCountParams(): Object {
        const params = {
            where: {
                and: []
            }
        };
        /** Filters */
        if (this.filter && this.filter.where) {
            Object.keys(this.filter.where).forEach((key) => {
                const condition = {};
                if (this.settings.columns[key]) {
                    if (this.settings.columns[key].type === 'boolean') {
                        condition[key] = this.filter.where[key];
                    } else {
                        condition[key] = {
                            like: '%' + this.filter.where[key] + '%'
                        };
                    }
                } else {
                    condition[key] = this.filter.where[key];
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

                if (action.config.params) {
                    if (action.config.params.id && action.config.params.id === true) {
                        action.config.params.id = data.id;
                    }

                    if (action.config.params.filter && action.config.params.filter.indexOf(':id') !== -1) {
                        action.config.params.filter = action.config.params.filter.replace(':id', data.id);
                    }

                    if (action.config.params.tableKey && data[action.config.params.tableKey]) {
                        let key = action.config.params.tableKey;
                        if (action.config.params.formKey) {
                            key = action.config.params.formKey;
                        }

                        action.config.params['formValues'] = {};
                        action.config.params['formValues'][key] = data[action.config.params.tableKey];

                        delete action.config.params.tableKey;
                        delete action.config.params.formKey;
                    }

                    console.log(action.config.params);

                    this._storageService.setValue(action.config.params.type, action.config.params);
                }

                /**
                 * If is table auto-update (sub categories for example), refresh same component
                 */
                if (('/panel/' + path) !== this._router.url) {
                    this._router.navigate(['panel/' + path]);
                } else {
                    this.ngOnInit();
                }
            }
        } else if (action.config.endpoint) {
            let endpoint = action.config.endpoint;
            if (endpoint.indexOf(':id') !== -1) {
                endpoint = endpoint.replace(':id', data.id);
            }

            if (action.config.method) {
                this.handleActionApi(action, endpoint, data)
                    .then(() => {
                        if (action.config.refreshAfter !== false) {
                            this.getData();
                        }
                    })
                    .catch((response: any) => {
                        if (response instanceof HttpErrorResponse) {
                            this._toast.error(response.message);
                        } else {
                            this._toast.error(response);
                        }
                    });
            }
        }
    }

    private handleActionApi(action: TableAction, endpoint: string, data?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            switch (action.config.method) {
                case 'post': { // TODO (only if necessary)
                    resolve();
                }
                    break;
                case 'put': { // TODO (only if necessary)
                    resolve();
                }
                    break;
                case 'patch': { // TODO (only if necessary)
                    resolve();
                }
                    break;

                case 'get': {
                    if (action.config.confirm) {
                        this._modal.confirm()
                            .then(() => {
                                this._apiService.get(endpoint)
                                    .then((response) => {
                                        this.handleResponseApi(action, response)
                                            .then(() => resolve())
                                            .catch((error) => reject(error));
                                    })
                                    .catch((response: HttpErrorResponse) => {
                                        reject(response);
                                    });
                            }).catch(() => {
                        });
                    } else {
                        this._apiService.get(endpoint)
                            .then((response) => {
                                this.handleResponseApi(action, response)
                                    .then(() => resolve())
                                    .catch((error) => reject(error));
                            })
                            .catch((response: HttpErrorResponse) => {
                                reject(response);
                            });
                    }
                }
                    break;
                case 'delete': {
                    if (action.config.confirm) {
                        this._modal.confirm()
                            .then(() => {
                                this._apiService.delete(endpoint)
                                    .then((response) => {
                                        this.handleResponseApi(action, response)
                                            .then(() => resolve())
                                            .catch((error) => reject(error));
                                    })
                                    .catch((response: HttpErrorResponse) => {
                                        reject(response);
                                    });
                            })
                            .catch(() => {
                            });
                    } else {
                        this._apiService.delete(endpoint)
                            .then((response) => {
                                this.handleResponseApi(action, response)
                                    .then(() => resolve())
                                    .catch((error) => reject(error));
                            })
                            .catch((response: HttpErrorResponse) => {
                                reject(response);
                            });
                    }
                }
                    break;
            }
        });
    }

    private handleResponseApi(action: TableAction, response: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (action.config.responseType && action.config.responseType !== 'default') {
                switch (action.config.responseType) {
                    // TODO: implemented in a switch case to easily future support for new response types
                    case 'file_download': {

                        if (action.config.file) {
                            const now = new Date();

                            const name = (action.config.file.name) ? action.config.file.name : 'table';

                            const fileName = name + '_' + now.toISOString().substring(0, 19) + '.' + action.config.file.extension;
                            const fileType = UtilsService.getFileType(action.config.file.extension);

                            const blob = new Blob([response], {type: fileType});
                            const file = new File([blob], fileName, {type: fileType});
                            (FileSaver as any).saveAs(file);

                            resolve();
                        } else {
                            reject('File configuration not defined');
                        }

                    }
                        break;
                    default: {

                    }
                        break;
                }
            } else {
                this._toast.success('message', 'Success');
                resolve();
            }
        });
    }

    onAction(event: { action: TableAction, data?: any }) {
        this.parseAction(event.action, event.data);
    }

    onCreate() {
        this.parseAction(this.settings.actions.add);
    }

    onRowSelect(event: TableSelection) {
        console.log('ON Select row(s)');
        console.log(event);
    }

    onRowDrop(event: any) {

        const dragDropSettings: TableDrop = {
            data: event.data,
            page: this.activeFilters.pagination.page,
            perPage: this.activeFilters.pagination.perPage
        };

        if (this.settings.drag) {
            const endpoint = this.settings.drag.endpoint ?
                this.settings.drag.endpoint : this.settings.api.endpoint + '/sort';

            if (this.settings.drag.method) {
                // TODO: support if necessary
            } else {
                this._apiService.patch(endpoint, dragDropSettings)
                    .then(() => {
                        this.getData(); // Refresh table
                    })
                    .catch((response: HttpErrorResponse) => {
                        this._toast.error(response.message, 'Sort error');
                    });
            }
        }
    }

    onFilter(filter: TableFilter) {
        if (!_.isEmpty(filter)) {
            this.filter.where = filter;
        }
        this.getData();
        this.activeFilters.filter = filter;
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
