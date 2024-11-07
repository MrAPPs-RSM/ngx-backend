import { Component, Input, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { TableSettings } from './interfaces/table-settings';
import { ApiService, ErrorResponse } from '../../../api/api.service';
import { ModalService } from '../../services/modal.service';
import { TableFilter } from '../../modules/ng2-smart-table/lib/data-filters/table-filter';
import { TableSort } from '../../modules/ng2-smart-table/lib/data-filters/table-sort';
import { TablePagination } from '../../modules/ng2-smart-table/lib/data-filters/table-pagination';
import { TableActiveFilters } from '../../modules/ng2-smart-table/lib/data-filters/table-active-filters';
import { TableDrop } from '../../modules/ng2-smart-table/lib/data-filters/table-drop';
import { Association, TableAction } from './interfaces/table-action';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { UtilsService } from '../../../services/utils.service';
import { Language, LanguageService } from '../../services/language.service';
import { ToastsService } from '../../../services/toasts.service';
import { PageRefreshService } from '../../../services/page-refresh.service';
import { Subscription } from 'rxjs';
import { GlobalState } from '../../../global.state';
import { isArray } from 'lodash';
import { BaseLongPollingComponent } from '../base-long-polling/base-long-polling.component';
import { environment } from '../../../../environments/environment';
import { UtilsV2Service } from '../../../services/utils-v2.service';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TableComponent extends BaseLongPollingComponent implements OnInit, OnDestroy {

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

    public data: any[];
    public activeFilters: TableActiveFilters = { // Need for table, not for API
        sort: [],
        filter: {}
    };
    public count: number;

    private filter: any = {}; // Need for API, not for table

    private resetPagination: boolean;

    isMultiLangEnabled = false;
    currentLang: Language;

    private _subscription = Subscription.EMPTY;

    constructor(public _languageService: LanguageService,
        private _pageRefresh: PageRefreshService,
        _apiService: ApiService,
        private _state: GlobalState,
        private _router: Router,
        private _route: ActivatedRoute,
        private _toast: ToastsService,
        private _modal: ModalService) {
        super(_apiService);
    }

    private extractKey(input: string): string | null {
        const match = input.match(/filter\[(\w+)]/);
        return match ? match[1] : null;
    }

    ngOnInit() {
        this.translateLabels();
        this.resetPagination = false;
        this._subscription = this._route.queryParams.subscribe(params => {
            this.activeFilters.pagination = {
                page: 1,
                perPage: this.preparePerPage(),
            };

            /** Read fixed filter from settings if set */
            if (this.settings.api.filter) {
                this.filter = this.settings.api.filter;
            }

            if (params) {
                if (environment.version && environment.version >= 2) {
                    this.filter = UtilsV2Service.composeFilters(this.filter, params);
                } else {
                    if (params['listParams']) {
                        const queryParamsFilter = JSON.parse(params['listParams']);

                        this.filter = UtilsService.mergeDeep(this.filter, queryParamsFilter);
                    }
                }

                this.activeFilters.pagination.perPage = 'limit' in this.filter
                    ? this.filter['limit'] : this.preparePerPage();
                this.activeFilters.pagination.page = 'skip' in this.filter ?
                    this.filter['skip'] / this.activeFilters.pagination.perPage + 1 : 1;
            }

            this.activeFilters.filter = this.filter;

            if ('order' in this.filter && this.filter['order'] !== null) {
                const sortArray = isArray(this.filter.order) ? this.filter.order : this.filter.order.split(',');
                this.filter.order = [];
                for (let i = 0; i < sortArray.length; i++) {

                    let field = '';
                    let direction = '';
                    if (typeof sortArray[i] === 'string') {
                        const splitted = sortArray[i].trim().split(' ');
                        field = splitted[0];
                        direction = splitted[1];
                    } else if ('field' in sortArray[i] && 'direction' in sortArray[i]) {
                        field = sortArray[i]['field'];
                        direction = sortArray[i]['direction'];
                    } else {
                        continue;
                    }

                    this.filter.order.push({
                        field,
                        direction
                    });
                }
            }

            this.activeFilters.sort = this.filter.order;
            this.prepareActions();
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

    private prepareActions() {
        if ('actions' in this.settings && !this.settings.actions.list) {
            this.settings.actions.list = [];
        }
    }

    private prepareColumnFilter(column: any, defaultValue?: any): any {
        if (column.filter !== false) {
            let filter: any = column.filter;
            switch (column.type) {
                case 'boolean': {
                    filter = { type: 'checkbox' };
                }
                    break;
                case 'date': {
                    filter = { type: 'date' };
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
            if (perPage >= 100) {
                return 100;
            } else if (perPage >= 50) {
                return 50;
            } else if (perPage >= 25) {
                return 25;
            } else if (perPage >= 10) {
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
            this._apiService.get(this.composeEndpoint(this.settings.api.endpoint), this.composeParams())
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
                    this.getData(false);
                })
                .catch((response: ErrorResponse) => {
                    this.isLoading = false;
                    this._toast.error(response.error);
                });
        }
    }

    private getCount(): Promise<any> {
        const endpoint = this.settings.api.countEndpoint ? this.settings.api.countEndpoint : this.settings.api.endpoint + '/count';
        return this._apiService.get(this.composeEndpoint(endpoint), this.composeCountParams());
    }

    private composeEndpoint(endpoint: string) {
        if (endpoint.indexOf(':') < 0) {
            return endpoint;
        }

        if (!this.activeFilters.filter) {
            return endpoint;
        }

        if (environment.version && environment.version >= 2) {
            return UtilsV2Service.getEndpoint(endpoint, this.activeFilters.filter);
        }

        const filterKeys = Object.keys('where' in this.activeFilters.filter
            ? this.activeFilters.filter.where
            : this.activeFilters.filter);
        for (const key of filterKeys) {
            if (endpoint.indexOf(':' + key) >= 0) {
                const regex = new RegExp(':' + key, 'g');
                const value = 'where' in this.activeFilters.filter
                    ? this.activeFilters.filter.where[key]
                    : this.activeFilters.filter[key];
                endpoint = endpoint.replace(regex, value);
            }
        }

        return endpoint;
    }

    private prepareResponseFilters(filters: Array<any>): Object {
        const response = {};
        filters.forEach((filter: any) => {
            const keys = Object.keys(filter);
            if (keys.length === 0) {
                return;
            }

            const key = keys[0];
            if (['skip', 'limit', 'order'].includes(key)) {
                return;
            }

            let value: string = filter[key];
            if (this.settings.columns[key]) {
                switch (this.settings.columns[key].type) {
                    case 'date': {
                        value = 'from' in filter[key]
                            ? `${filter[key].from.toISOString()},${filter[key].to.toISOString()}`
                            : filter[key].toISOString();
                        break;
                    }
                }
            }
            response[`filter[${key}]`] = value;
        });

        return response;
    }
    private composeParams(countParams?: boolean, queryParams?: boolean, addInclude?: boolean): Object {
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
            if (this.activeFilters.pagination) {
                params.limit = this.activeFilters.pagination.perPage;
                params.skip = (this.activeFilters.pagination.page - 1) * params.limit;
            }

            /** Sort (if drag enabled, always sort by weight ascending) */
            if (this.settings.drag) {
                params.order = this.settings.drag.sortField ? this.settings.drag.sortField : this.DEFAULTS.drag.sortField;
                params.order += ' ASC';
            } else {
                if (this.filter.order && this.filter.order.length > 0) {
                    let order = '';
                    for (let i = 0; i < this.filter.order.length; i++) {
                        const sort = this.filter.order[i];
                        order += (order.length > 0 ? ', ' : '') + sort.field + ' ' + sort.direction.toUpperCase();
                    }
                    params.order = order;
                }
            }
        }

        /** Filters */
        if (this.filter && !queryParams) {

            if (this.filter.where && !environment.version || environment.version < 2) {

                if ('and' in this.filter.where) {

                    this.filter.where['and'].forEach((object) => {
                        const condition = {};
                        const key = Object.keys(object)[0];
                        if (this.settings.columns[key]) {
                            switch (this.settings.columns[key].type) {
                                case 'boolean': {
                                    condition[key] = object[key];
                                }
                                    break;
                                case 'date': {
                                    condition[key] = {
                                        between: [object[key].from, object[key].to]
                                    };
                                }
                                    break;
                                default: {
                                    condition[key] = {
                                        like: '%' + object[key] + '%'
                                    };
                                }
                                    break;
                            }
                        } else {
                            condition[key] = object[key];
                        }
                        params.where.and.push(condition);
                    });

                } else {
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
                }

                if (this.resetPagination && !countParams) {
                    this.resetPagination = false;
                    params.skip = 0; // reset pagination if filters
                }
            }

            if (this.filter.include) {
                params['include'] = this.filter.include;
            }
        }

        if (addInclude) {
            if (this.filter.include && !params['include']) {
                params['include'] = this.filter.include;
            }
        }

        if (queryParams) {
            params.where = this.filter.where;
        }

        let response = {};

        if (environment.version && environment.version >= 2) {

            if (this.filter) {
                if ('where' in this.filter) {
                    if ('and' in this.filter.where) {
                        response = this.prepareResponseFilters(this.filter.where.and);
                    } else {
                        response = this.prepareResponseFilters(Object.keys(this.filter.where).map((key) => {
                            const value = {};
                            value[key] = this.filter.where[key];
                            return value;
                        }));
                    }
                }
            }

            response['order'] = params.order;
            response['skip'] = params.skip;
            response['limit'] = params.limit;
        } else {
            response['filter'] = JSON.stringify(params);
        }

        /** Lang, if enabled */
        if (this.currentLang) {
            response['lang'] = this.currentLang.isoCode;
        }

        return response;
    }

    private composeCountParams(): Object {
        return this.composeParams(true);
    }

    private parseAction(action: TableAction, data?: any): void {
        // action = config.params.filter have filters
        // data = row data
        let extraParams = {};

        let path = action.config.path;

        if (path) {
            if (!data) {

                if (action.config.params && action.config.params.associateFields && action.config.params.associateFields.length > 0) {
                    const params = {};

                    action.config.params.associateFields.forEach((association: Association) => {
                        const queryKey = association.queryKey.indexOf('where') >= 0 || association.queryKey.indexOf('.') >= 0
                            ? association.queryKey
                            : 'where.' + association.queryKey;
                        params[association.formKey] = environment.version && environment.version >= 2
                            ? UtilsV2Service.objectByString(this.filter, queryKey)
                            : UtilsService.objectByString(this.filter, queryKey);
                    });

                    extraParams = { queryParams: { formParams: JSON.stringify(params) }, relativeTo: this._route.parent };

                    this._router.navigate(['../panel/' + path], extraParams);
                } else {
                    this._router.navigate(['../panel/' + path], { relativeTo: this._route.parent });
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
                    path = path.replace(':id', encodeURIComponent(idValue ? idValue : data.id));
                }

                if (action.config.titleField && path.indexOf(':title') !== -1) {
                    const titleValue = UtilsService.objectByString(data, action.config.titleField);
                    path = path.replace(':title', titleValue !== null && titleValue !== '' ? titleValue : '---');
                }

                if (action.config.params) {

                    if (action.config.params.filter) {

                        let updatedFilter: any = action.config.params.filter;

                        // Parse all parameters with key
                        updatedFilter = UtilsService.parseParams(updatedFilter, data);

                        if (UtilsService.isObject(updatedFilter)) {
                            updatedFilter = JSON.stringify(updatedFilter);
                        }

                        if (updatedFilter.indexOf(':id') !== -1) {
                            updatedFilter = updatedFilter.replace(
                                ':id',
                                encodeURIComponent(
                                    'idField' in action.config ? data[action.config['idField']] : data.id
                                )
                            );
                        }

                        let queryParams = {};
                        if (environment.version && environment.version >= 2) {
                            queryParams['listParams'] = updatedFilter;
                        } else {
                            queryParams['listParams'] = updatedFilter;
                        }

                        extraParams = { queryParams };
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
                        extraParams = { queryParams: { formParams: JSON.stringify(formValues) } };

                        delete action.config.params.associateFields;
                    }
                }
                /**
                 * If is table auto-update (sub categories for example), refresh same component
                 */
                if (this.isMultiLangEnabled) {
                    if (extraParams.hasOwnProperty('queryParams')) {
                        extraParams['queryParams']['currentLang'] = this.currentLang.isoCode;
                    } else {
                        extraParams = { queryParams: { currentLang: this.currentLang.isoCode } };
                    }
                }

                path = UtilsService.parseEndpoint(path, data);

                extraParams['relativeTo'] = this._route.parent;
                this._router.navigate(['../panel/' + path], extraParams);
            }
        } else if (action.config.endpoint) {
            let endpoint = action.config.endpoint;
            if (endpoint.indexOf(':id') !== -1) {
                endpoint = endpoint.replace(
                    ':id',
                    encodeURIComponent(
                        'idField' in action.config ? data[action.config['idField']] : data.id
                    )
                );
            }

            // Parse others endpoint parameters
            endpoint = UtilsService.parseEndpoint(endpoint, data);

            if (action.config.method) {
                this.isLoading = true;
                this.handleActionApi(action, endpoint, action.config.endpointData, data)
                    .then(() => {
                        if (action.config.refreshAfter !== false) {
                            this.getData();
                        }
                    })
                    .catch((response: ErrorResponse | any) => {
                        this.isLoading = false;
                        this._toast.error(response.error);
                    });
            }
        }
    }

    private handleActionApi(action: TableAction, endpoint: string, endpointData?: any, data?: any): Promise<any> {
        return new Promise((resolve, reject) => {

            const manageError = (error: any) => {
                this.isLoading = false;
                reject(error);
            };
            switch (action.config.method) {
                case 'post': {

                    const executeOperation = () => {
                        this.isLoading = true;
                        this._apiService.post(endpoint, {})
                            .then((response) => {
                                this.handleResponseApi(action, response)
                                    .then(() => resolve(true))
                                    .catch(manageError);
                            })
                            .catch(manageError);
                    };

                    if (action.config.confirm) {
                        this.isLoading = false;
                        this._modal.confirm()
                            .then(executeOperation)
                            .catch(() => {
                                this.isLoading = false;
                            });
                    } else {
                        executeOperation();
                    }
                }
                    break;
                case 'put': { // TODO (only if necessary)
                    resolve(true);
                }
                    break;
                case 'patch': {
                    if (typeof endpointData !== 'undefined' && endpointData) {

                        const executeOperation = () => {
                            try {
                                this.isLoading = true;
                                const body = JSON.parse(endpointData);
                                this._apiService.patch(endpoint, body)
                                    .then((response) => {
                                        this.handleResponseApi(action, response)
                                            .then(() => resolve(true))
                                            .catch(manageError);
                                    })
                                    .catch(manageError);
                            } catch (e) {
                                reject({ error: { message: 'endpointData is not a valid JSON' } });
                            }
                        };

                        if (action.config.confirm) {
                            this.isLoading = false;
                            this._modal.confirm()
                                .then(executeOperation)
                                .catch(() => {
                                    this.isLoading = false;
                                });
                        } else {
                            executeOperation();
                        }
                    } else {
                        resolve(true);
                    }
                }
                    break;
                case 'get': {

                    const executeOperation = () => {
                        this.isLoading = true;
                        if (action.config.responseType === 'file_download' && action.config.forceDownload) {
                            (window as any).open(
                                this._apiService.composeUrl(
                                    endpoint,
                                    true,
                                    action.config.addFilters ? this.composeCountParams() : null
                                )
                            );
                            resolve(true);
                        } else {
                            this._apiService.get(endpoint, action.config.addFilters ? this.composeCountParams() : null)
                                .then((response) => {
                                    this.handleResponseApi(action, response)
                                        .then(() => resolve(true))
                                        .catch(manageError);
                                })
                                .catch(manageError);
                        }
                    };

                    if (action.config.confirm) {
                        this.isLoading = false;
                        this._modal.confirm()
                            .then(executeOperation)
                            .catch(() => {
                                this.isLoading = false;
                            });
                    } else {
                        executeOperation();
                    }
                }
                    break;
                case 'delete': {

                    const executeOperation = () => {
                        this.isLoading = true;
                        this._apiService.delete(endpoint)
                            .then((response) => {
                                this.handleResponseApi(action, response)
                                    .then(() => resolve(true))
                                    .catch(manageError);
                            })
                            .catch(manageError);
                    };

                    if (action.config.confirm) {
                        this.isLoading = false;
                        const title = action.config.modal && action.config.modal.delete && action.config.modal.delete.title ?
                            action.config.modal.delete.title : null;
                        const body = action.config.modal && action.config.modal.delete && action.config.modal.delete.body ?
                            action.config.modal.delete.body : null;
                        this._modal.confirm(title, body)
                            .then(executeOperation)
                            .catch(() => {
                                this.isLoading = false;
                            });
                    } else {
                        executeOperation();
                    }
                }
                    break;
            }
        });
    }

    private async handleResponseApi(action: TableAction, response: any): Promise<any> {
        if ('progress_url' in response) {
            response = await this.checkProgressStatus(response);
        }

        if (action.config.responseType) {
            switch (action.config.responseType) {
                case 'file_download': {
                    if (action.config.file) {
                        const now = new Date();

                        const name = (action.config.file.name) ? action.config.file.name : 'table';

                        const fileName = name + '_' + now.toISOString().substring(0, 19) + '.' + action.config.file.extension;
                        const fileType = UtilsService.getFileType(action.config.file.extension);

                        const blob = new Blob([response], { type: fileType });
                        const file = new File([blob], fileName, { type: fileType });
                        FileSaver.saveAs(file);
                        return true;
                    } else {
                        throw Error('File configuration not defined');
                    }
                }
                default: {
                    this._toast.success();
                    return true;
                }
            }
        } else {
            this._toast.success();
            return true;
        }
    }

    onAction($event: { action: TableAction, data?: any }) {
        this.parseAction($event.action, $event.data);
    }

    onCreate() {
        this.parseAction(this.settings.actions.add);
    }

    onRowDrop($event: any) {
        const dragDropSettings: TableDrop = {
            data: $event.data,
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

    refreshTable() {
        const params = this.composeParams(false, true, true);
        this._state.replaceLastPath = true;
        let queryParams = {};
        if (environment.version && environment.version >= 2) {
            queryParams = params;
        } else {
            queryParams['listParams'] = params['filter'];
        }
        this._router.navigate([], { queryParams });
    }

    onFilter(filter: TableFilter) {
        if (typeof this.filter.where === 'undefined') {
            this.filter.where = {};
        }

        this.resetPagination = true;

        Object.keys(filter).forEach((key) => {
            if (filter[key] !== null && filter[key] !== '') {
                this.resetPagination = this.resetPagination && false;
                this.filter.where[key] = filter[key];
            } else {
                if (this.filter.where[key]) {
                    delete this.filter.where[key];
                }
            }
        });

        this.resetPagination = !this.resetPagination;
        this.refreshTable();
    }

    onPagination(pagination: TablePagination) {
        this.activeFilters.pagination = pagination;
        this.refreshTable();
    }

    onSort(sort: TableSort[]) {
        this.filter.order = sort;
        this.refreshTable();
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
