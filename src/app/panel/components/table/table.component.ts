import {Component, Input, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import {TableSettings} from './interfaces/table-settings';
import {ApiService, ErrorResponse} from '../../../api/api.service';
import {ModalService} from '../../services/modal.service';
import {TableFilter} from '../../modules/ng2-smart-table/lib/data-filters/table-filter';
import {TableSort} from '../../modules/ng2-smart-table/lib/data-filters/table-sort';
import {TablePagination} from '../../modules/ng2-smart-table/lib/data-filters/table-pagination';
import {TableSelection} from '../../modules/ng2-smart-table/lib/data-filters/table-selection';
import {TableActiveFilters} from '../../modules/ng2-smart-table/lib/data-filters/table-active-filters';
import {TableDrop} from '../../modules/ng2-smart-table/lib/data-filters/table-drop';
import {Association, TableAction} from './interfaces/table-action';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';
import {UtilsService} from '../../../services/utils.service';
import {Language, LanguageService} from '../../services/language.service';
import {ToastsService} from '../../../services/toasts.service';
import {PageRefreshService} from '../../../services/page-refresh.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnInit, OnDestroy {

    @Input() settings: TableSettings;

    private readonly DEFAULTS = {
        perPageValues: [5, 10, 25, 50],
        pager: {
            perPage: 10
        },
        drag: {
            sortField: 'weight'
        }
    };

    isLoading = false;

    public data: any[];
    public activeFilters: TableActiveFilters = {}; // Need for table, not for API
    public count: number;

    private filter: any = {}; // Need for API, not for table
    private sort: TableSort;
    private pagination: TablePagination;

    private resetPagination: boolean;

    isMultiLangEnabled = false;
    currentLang: Language;

    private _subscription = Subscription.EMPTY;

    constructor(public _languageService: LanguageService,
                private _pageRefresh: PageRefreshService,
                private _apiService: ApiService,
                private _router: Router,
                private _route: ActivatedRoute,
                private _toast: ToastsService,
                private _modal: ModalService) {
    }

    ngOnInit() {
        this.translateLabels();
        this.resetPagination = false;
        this._subscription = this._route.queryParams.subscribe(params => {
            this.activeFilters.sort = [];
            this.activeFilters.pagination = {
                page: 1,
                perPage: this.preparePerPage(),
            };

            /** Read fixed filter from settings if set */
            if (this.settings.api.filter) {
                this.filter = JSON.parse(this.settings.api.filter);
            }

            if (this._route.snapshot.queryParams && this._route.snapshot.queryParams['listParams']) {
                const queryParamsFilter = JSON.parse(this._route.snapshot.queryParams['listParams']);
                this.filter = UtilsService.mergeDeep(this.filter, queryParamsFilter);
            }

            if ('order' in this.filter) {
                const sort = this.filter.order.split(' ');
                this.sort = {
                    field: sort[0],
                    direction: sort[1]
                };
            }

            this.prepareColumns();
            this.getData();
        });

        this.setupLang();
    }

    private prepareColumns(): void {
        Object.keys(this.settings.columns).forEach((column) => {
            let defaultValue;
            if (this.settings.columns[column].filter && this.settings.columns[column].filter.default) {
                if (typeof this.settings.columns[column].filter.default === 'string') {
                    defaultValue = UtilsService.objectByString(
                        this.filter,
                        this.settings.columns[column].filter.default);
                }
                // Support raw value
                if (typeof defaultValue === 'undefined') {
                    defaultValue = this.settings.columns[column].filter.default;
                }
            }

            this.settings.columns[column].filter = this.prepareColumnFilter(
                this.settings.columns[column],
                defaultValue
            );
        });
    }

    private prepareColumnFilter(column: any, defaultValue?: any): any {
        if (column.filter !== false) {
            let filter: any = column.filter;
            switch (column.type) {
                case 'boolean': {
                    filter = {type: 'checkbox'};
                }
                    break;
                case 'date': {
                    filter = {type: 'date'};
                }
                    break;
            }

            if (!filter) {
                filter = {};
            }

            if (typeof defaultValue !== 'undefined') {
                filter.default = defaultValue;
            }
            return filter;
        } else {
            return column.filter;
        }
    }

    private translateLabels(): void {
        this.settings.noDataMessage = this.settings.noDataMessage ?
            this.settings.noDataMessage : this._languageService.translate('tables.noDataMessage');
        if (this.settings.actions) {
            this.settings.actions.columnTitle = this.settings.actions.columnTitle ?
                this.settings.actions.columnTitle :
                this._languageService.translate('tables.actions.columnTitle');
        }
    }

    private preparePerPage(): number {
        const perPage = this.settings.pager && this.settings.pager.perPage ? this.settings.pager.perPage : this.DEFAULTS.pager.perPage;
        if (this.DEFAULTS.perPageValues.indexOf(perPage) > -1) {
            return perPage;
        } else {
            if (perPage > 50) {
                return 50;
            } else if (perPage > 25) {
                return 25;
            } else if (perPage > 10) {
                return 10;
            } else {
                return 5;
            }
        }
    }

    private setupLang(): void {
        this.isMultiLangEnabled = this.settings.lang && this._languageService.getContentLanguages().length > 0;
        if (this.isMultiLangEnabled) {

            const currentLanguage = this._languageService.getCurrentContentTableLang();

            if (currentLanguage == null) {
                for (const contentLanguage of this._languageService.getContentLanguages()) {
                    if (contentLanguage.isDefault) {
                        this.currentLang = contentLanguage;
                        this._languageService.setCurrentContentTableLang(contentLanguage);
                    }
                }
            } else {
                this.currentLang = currentLanguage;
            }
        }
    }

    private getData(doCount?: boolean): void {
        this.isLoading = true;

        if (doCount === false) {
            this._apiService.get(this.settings.api.endpoint, this.composeParams())
                .then((data) => {
                    // console.log(data);
                    this.isLoading = false;
                    this.data = data;
                })
                .catch((response: ErrorResponse) => {
                    this.isLoading = false;
                    this._toast.error(response.error);
                });
        } else {
            this.getCount()
                .then((res: { count: number }) => {
                    this.count = res.count;
                    this._apiService.get(this.settings.api.endpoint, this.composeParams())
                        .then((data) => {
                            // console.log(data);
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
    }

    private getCount(): Promise<any> {
        const endpoint = this.settings.api.countEndpoint ? this.settings.api.countEndpoint : this.settings.api.endpoint + '/count';
        return this._apiService.get(endpoint, this.composeCountParams());
    }

    private composeParams(countParams?: boolean): Object {
        if (countParams === null) {
            countParams = false;
        }

        const params: any = countParams ?
            {
                where: {
                    and: []
                },
            } :
            {
                where: {
                    and: []
                },
                order: null,
                skip: 0,
                limit: this.preparePerPage(),
            };

        if (!countParams) {
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
        }

        /** Filters */
        if (this.filter) {

            if (this.filter.where) {
                Object.keys(this.filter.where).forEach((key) => {
                    const condition = {};
                    if (this.settings.columns[key]) {
                        switch (this.settings.columns[key].type) {
                            case 'boolean': {
                                condition[key] = this.filter.where[key];
                            }
                                break;
                            case 'date': {
                                condition[key] = {
                                    between: [this.filter.where[key].from, this.filter.where[key].to]
                                };
                            }
                                break;
                            default: {
                                condition[key] = {
                                    like: '%' + this.filter.where[key] + '%'
                                };
                            }
                                break;
                        }
                    } else {
                        condition[key] = this.filter.where[key];
                    }
                    params.where.and.push(condition);
                });

                if (this.resetPagination && !countParams) {
                    params.skip = 0; // reset pagination if filters
                }
            }

            if (this.filter.include) {
                params['include'] = this.filter.include;
            }
        }

        // console.log(params);

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
        return this.composeParams(true);
    }

    private parseAction(action: TableAction, data?: any): void {

        let extraParams = {};

        let path = action.config.path;

        if (path) {
            if (!data) {

                if (action.config.params && action.config.params.associateFields && action.config.params.associateFields.length > 0) {
                    const params = {};

                    action.config.params.associateFields.forEach((association: Association) => {
                        const queryKey = association.queryKey.indexOf('where') >= 0 || association.queryKey.indexOf('.') >= 0 ? association.queryKey : 'where.' + association.queryKey;
                        params[association.formKey] = UtilsService.objectByString(this.filter, queryKey);
                    });

                    extraParams = {queryParams: {formParams: JSON.stringify(params)}};

                    this._router.navigate(['panel/' + path], extraParams);
                } else {
                    this._router.navigateByUrl('panel/' + path);
                }
            } else {

                if (action.config.tableField && path.indexOf(':tableField') !== -1) {
                    const tableValue = UtilsService.objectByString(data, action.config.tableField);
                    if (tableValue) {
                        path = path.replace(':tableField', tableValue);
                    }
                }

                if (path.indexOf(':id') !== -1) {
                    let idValue = data.id;
                    if ('idField' in action.config) {
                        idValue = UtilsService.objectByString(data, action.config.idField);
                    }
                    path = path.replace(':id', idValue ? idValue : data.id);
                }

                if (action.config.titleField && path.indexOf(':title') !== -1) {
                    const titleValue = UtilsService.objectByString(data, action.config.titleField);
                    path = path.replace(':title', titleValue !== null && titleValue !== '' ? titleValue : '---');
                }

                if (action.config.params) {

                    if (action.config.params.filter) {

                        let updatedFilter = action.config.params.filter;

                        if (UtilsService.isObject(updatedFilter)) {
                            updatedFilter = JSON.stringify(updatedFilter);
                        }

                        if (updatedFilter.indexOf(':id') !== -1) {
                            updatedFilter = updatedFilter.replace(':id', 'idField' in action.config ? data[action.config['idField']] : data.id);
                        }

                        extraParams = {queryParams: {listParams: updatedFilter}};
                    } else if (action.config.params.loadData) {
                        extraParams = {
                            queryParams: {
                                loadData: JSON.stringify({
                                    id: data.id,
                                    endpoint: action.config.params.endpoint
                                })
                            }
                        };
                    } else if (action.config.params.associateFields && action.config.params.associateFields.length > 0) {
                        action.config.params['formValues'] = {};

                        action.config.params.associateFields.forEach((association: Association) => {
                            let key = association.tableKey;
                            if (association.formKey) {
                                key = association.formKey;
                            }
                            action.config.params['formValues'][key] = data[association.tableKey];
                        });

                        const formValues = action.config.params['formValues'];
                        extraParams = {queryParams: {formParams: JSON.stringify(formValues)}};

                        delete action.config.params.associateFields;
                    }
                }
                /**
                 * If is table auto-update (sub categories for example), refresh same component
                 */

                this._router.navigate(['panel/' + path], extraParams);
            }
        } else if (action.config.endpoint) {
            let endpoint = action.config.endpoint;
            if (endpoint.indexOf(':id') !== -1) {
                endpoint = endpoint.replace(':id', 'idField' in action.config ? data[action.config['idField']] : data.id);
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
                                if (action.config.refreshAfter !== false) {
                                    this.isLoading = true;
                                }
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
                        if (action.config.refreshAfter !== false) {
                            this.isLoading = true;
                        }
                        // Adding countParams to filter without pagination and sort
                        this._apiService.get(endpoint, action.config.addFilters ? this.composeCountParams() : null)
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
                                if (action.config.refreshAfter !== false) {
                                    this.isLoading = true;
                                }
                                console.log(this.isLoading);
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
                        if (action.config.refreshAfter !== false) {
                            this.isLoading = true;
                        }
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
            if (action.config.responseType) {
                switch (action.config.responseType) {
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
                        this._toast.success();
                        resolve();
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
                if (filter[key] !== '' && filter[key] !== null && (!Array.isArray(filter[key]) || (Array.isArray(filter[key]) && filter[key].length > 0))) {
                    this.resetPagination = true;
                    this.filter.where[key] = Array.isArray(filter[key]) ? {'inq': filter[key]} : filter[key];
                } else {
                    this.resetPagination = false;
                    delete this.filter.where[key];
                }
            });
        } else {
            this.filter.where = filter;
        }

        this.getData();
        this.activeFilters.filter = filter;
    }

    onPagination(pagination: TablePagination) {
        this.pagination = pagination;
        this.getData(false);
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
        this._languageService.setCurrentContentTableLang(language);
        this.getData();
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

}
