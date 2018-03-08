import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {TableSettings} from './interfaces/table-settings';
import {ApiService, ErrorResponse} from '../../../api/api.service';
import {ModalService} from '../../services/modal.service';
import {TableFilter} from '../../modules/ng2-smart-table/lib/data-filters/table-filter';
import {TableSort} from '../../modules/ng2-smart-table/lib/data-filters/table-sort';
import {TablePagination} from '../../modules/ng2-smart-table/lib/data-filters/table-pagination';
import {TableSelection} from '../../modules/ng2-smart-table/lib/data-filters/table-selection';
import {TableActiveFilters} from '../../modules/ng2-smart-table/lib/data-filters/table-active-filters';
import {TableDrop} from '../../modules/ng2-smart-table/lib/data-filters/table-drop';
import {TableAction} from './interfaces/table-action';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';
import {UtilsService} from '../../../services/utils.service';
import {StorageService} from '../../../services/storage.service';
import {Language, LanguageService} from '../../services/language.service';
import {ToastsService} from '../../../services/toasts.service';

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
    public activeFilters: TableActiveFilters = {}; // Need for table, not for API
    public count: number;

    private filter: any = {}; // Need for API, not for table
    private sort: TableSort;
    private pagination: TablePagination;

    private isMultiLangEnabled: boolean = false;
    private currentLang: Language;

    constructor(public _languageService: LanguageService,
                private _apiService: ApiService,
                private _router: Router,
                private _route: ActivatedRoute,
                private _toast: ToastsService,
                private _modal: ModalService,
                private _storageService: StorageService) {
    }

    ngOnInit() {
        this.setupLang();

        this.activeFilters.sort = [];
        this.activeFilters.pagination = {
            page: 1,
            perPage: this.settings.pager && this.settings.pager.perPage ? this.settings.pager.perPage : this.DEFAULTS.pager.perPage,
        };

        if (this._route.snapshot.queryParams && this._route.snapshot.queryParams.listParams) {
            this.filter = JSON.parse(this._route.snapshot.queryParams.listParams).filter;

            console.log(this.filter);
        } else {
            /** Read fixed filter from settings if set */
            if (this.settings.api.filter) {
                this.filter = JSON.parse(this.settings.api.filter);
            }
        }

        this.getData();
    }

    private setupLang(): void {
        this.isMultiLangEnabled = this.settings.lang && this._languageService.getContentLanguages().length > 0;
        if (this.isMultiLangEnabled) {
            for (const contentLanguage of this._languageService.getContentLanguages()) {
                if (contentLanguage.isDefault) {
                    this.currentLang = contentLanguage;
                }
            }
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
                    .catch((response: ErrorResponse) => {
                        this.isLoading = false;
                        this._toast.error(response.error);
                    });
            })
            .catch((response: ErrorResponse) => {
                this.isLoading = false;
                this._toast.error(response.error);
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

        console.log(params);

        const response = {
            filter: JSON.stringify(params),
            lang: null
        };

        /** Lang, if enabled */
        if (this.currentLang) {
            response.lang = this.currentLang.isoCode;
        } else {
            delete response.lang;
        }

        return response;
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

        const response = {
            where: JSON.stringify(params.where),
            lang: null
        };

        /** Lang, if enabled */
        if (this.currentLang) {
            response.lang = this.currentLang.isoCode;
        } else {
            delete response.lang;
        }

        return response;
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

                let extraParams = {};

                if (action.config.params) {
                    if (action.config.params.id && action.config.params.id === true) {
                        action.config.params.id = data.id;
                    }

                    if (action.config.params.filter && action.config.params.filter.indexOf(':id') !== -1) {
                        action.config.params.filter = JSON.parse(action.config.params.filter.replace(':id', data.id));
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

                    extraParams = { queryParams: { listParams: JSON.stringify(action.config.params)} };
                   // this._storageService.setValue(action.config.params.type, action.config.params);
                }

                /**
                 * If is table auto-update (sub categories for example), refresh same component
                 */
                this._router.navigate(['panel/' + path], extraParams);
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
                    .catch((response: ErrorResponse) => {
                        this._toast.error(response.error);
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
                                    .catch((response: ErrorResponse) => {
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
                            .catch((response: ErrorResponse) => {
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
                                    .catch((response: ErrorResponse) => {
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
                            .catch((response: ErrorResponse) => {
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
                this._toast.success();
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
                    .catch((response: ErrorResponse) => {
                        this._toast.error(response.error);
                    });
            }
        }
    }

    onFilter(filter: TableFilter) {
        if (this.filter.where) {
            Object.keys(filter).forEach((key) => {
                if (filter[key] !== '' && filter[key] !== null) {
                    this.filter.where[key] = filter[key];
                } else {
                    delete this.filter.where[key];
                }
            });
        } else {
            this.filter.where = filter;
        }

        console.log(this.filter);
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

    onLanguageChange(language: Language) {
        this.currentLang = language;
        this.getData();
    }

}
