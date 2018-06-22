import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {ActivatedRoute} from '@angular/router';
import {Language, LanguageService} from '../../../../services/language.service';
import {ApiService, ErrorResponse} from '../../../../../api/api.service';
import {FormFieldSelect} from '../../interfaces/form-field-select';
import {Subject} from 'rxjs/Subject';
import {SelectData} from '../select/select.component';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-select-2',
    templateUrl: './select-2.component.html',
    styleUrls: ['./select-2.component.scss']
})
export class Select2Component extends BaseInputComponent implements OnInit, OnDestroy  {

    @Input() field: FormFieldSelect;
    @Input() isEdit: boolean;
    @Input() unique?: Function;

    private endpoint: string;

    public options: SelectData[] = [];
    public selected: [{id: number | null, text: string}] = [];
    private params = {
        where: {
            and: []
        }
    };

    private observable: Subject<any>;
    private _subscription = Subscription.EMPTY;
    private _dependsSubscription = Subscription.EMPTY;
    private _subFieldSubscription = Subscription.EMPTY;

    constructor(private _apiService: ApiService,
                private _languageService: LanguageService,
                private _route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.addQueryParams();
        this.loadOptions().then(() => {
            if (this.isEdit) {
                /** Only if subField of list-detail-component */
                if (this.isSubField) {
                    this.getControl().updateValueAndValidity();
                    if (this.getControl().value !== null && typeof this.getControl().value !== 'undefined') {
                        this.updateSelectedOptions(this.getControl().value);
                    } else {
                        this._subFieldSubscription = this.getControl().parent.valueChanges.subscribe((value) => {
                            if (value && value[this.field.key]) {
                                this.updateSelectedOptions(value[this.field.key]);
                                this._subFieldSubscription.unsubscribe();
                            }
                        });
                    }
                } else {
                    this.listenValueChange();
                }
            } else {
                this.listenValueChange();
            }
        }).catch((err) => console.log(err));

        if (this.field.dependsOn) {
            const key = Array.isArray(this.field.dependsOn) ? this.field.dependsOn[0] : this.field.dependsOn;

            if (this.getControl(key)) {
                this._dependsSubscription = this.getControl(key).valueChanges.subscribe((value) => {
                    let keyNotSet = true;
                    const indexesToDelete: number[] = [];

                    this.params.where.and.forEach((cond, index) => {
                        if (Object.keys(cond)[0] === key) { // update if already set
                            if (value && value !== '') {
                                cond[key] = value;
                            } else {
                                indexesToDelete.push(index);
                            }
                            keyNotSet = keyNotSet && false;
                        }
                    });
                    if (keyNotSet) {
                        if (value && value !== '') {
                            const condition = {};
                            condition[key] = value;
                            this.params.where.and.push(condition);
                        }
                    }
                    if (indexesToDelete.length > 0) {
                        indexesToDelete.forEach((index) => {
                            this.params.where.and.splice(index, 1);
                        });
                    }

                    this.loadOptions(true)
                        .then(() => {
                            this.checkSelection();
                            this.updateSelectedOptions(this.getControl().value);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });
            }
        }
    }

    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }

        if (this._subFieldSubscription) {
            this._subFieldSubscription.unsubscribe();
        }
    }

    /** Used in edit mode, but also in create if value is pre-set from table or query params */
    listenValueChange(): void {
        /** If value already set, update select options */
        if (this.getControl().value !== null && typeof this.getControl().value !== 'undefined') {
            this.updateSelectedOptions(this.getControl().value);
        } else { /* Else, listen to first change */
            this._subscription = this.getControl().valueChanges.first().subscribe((value) => {
                this.updateSelectedOptions(value);
                this.refreshFormValue(value, {emitEvent: false});
                this._subscription.unsubscribe();
            });
        }
    }

    private updateSelectedOptions(value: any) {
        if (typeof value !== 'undefined' && value !== null) {
            value.forEach((item) => {
                this.options.forEach((option) => {
                    if (option.id === item.id) {
                        this.selected.push({
                            id: item.id,
                            text: option.text
                        });
                    }
                });
            });
            this.selected = [...this.selected];
        } else {
            this.selected = [];
        }
    }

    private addQueryParams(): void {
        if (this.field.options instanceof Array) {
            this.endpoint = null;
            return null;
        } else {
            const endpoint = this.field.options;
            let filter;
            if (endpoint.indexOf('?') !== -1) {
                const queryParams = endpoint.split('?')[1];
                if (queryParams.indexOf('where') !== -1) {
                    console.log(queryParams.split('where=')[1]);
                    filter = JSON.parse(queryParams.split('where=')[1]);
                }
                if (filter) {
                    if ('and' in filter) {
                        filter['and'].forEach((condition) => {
                            this.params.where.and.push(condition);
                        });
                    } else {
                        Object.keys(filter).forEach((key) => {
                            const obj = {};
                            obj[key] = filter[key];
                            this.params.where.and.push(obj);
                        });

                    }
                }
                this.endpoint = endpoint.split('?')[0];
            } else {
                this.endpoint = endpoint;
            }
        }
    }

    private checkSelection() {
        if (this.selected || (this.selected && this.selected.length > 0)) {
            let keepValue = false;
            this.options.forEach((option) => {
                if (this.field.multiple === true) {
                    (this.selected as SelectData[]).forEach((selection) => {
                        if (option.id === selection.id) {
                            keepValue = true;
                        }
                    });
                } else {
                    if (this.selected && option.id === this.selected.id) {
                        keepValue = true;
                    }
                }
            });

            if (!keepValue) {
                this.updateSelectedOptions(null);
                this.refreshFormValue(null);
            }
        }
    }

    private loadOptions(forceReload?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.endpoint) {
                if (this.options.length === 0 || forceReload === true) {
                    const queryParams = {
                        where: JSON.stringify(this.params.where)
                    };

                    if (this.isEdit) {
                        if (this.endpoint.indexOf(':id') !== -1) {
                            this.endpoint = this.endpoint.replace(':id', this._route.params['value'].id);
                        }

                        if (queryParams.where.indexOf(':id') !== -1) {
                            queryParams.where = queryParams.where.replace(':id', this._route.params['value'].id);
                        }
                    }
                    /** Add lang if not set by setup.json but defined in select*/
                    if (this.field.lang) {
                        let lang: Language = null;
                        if (this.endpoint.indexOf('lang=') === -1) {
                            lang = this._languageService.getCurrentLang();
                        }

                        if (lang) {
                            queryParams['lang'] = lang.isoCode;
                        }
                    }

                    this._apiService.get(this.endpoint, queryParams)
                        .then((response) => {
                            this.options = this.filterOptionsIfNeeded(response);
                            this.setValueIfSingleOptionAndRequired();
                            resolve();
                        })
                        .catch((response: ErrorResponse) => {
                            // TODO: decide what to do if select options can't be loaded (back to prev page?, alert?, message?)
                            console.log(response.error);
                        });
                } else {
                    resolve();
                }
            } else {
                if (this.field.options instanceof Array) {
                    if (this.options.length === 0 || forceReload === true) {
                        this.options = this.filterOptionsIfNeeded(this.field.options);
                    }
                    this.setValueIfSingleOptionAndRequired();
                    resolve();
                }
            }
        });
    }

    onChange($event: any): void {
        this.refreshFormValue($event);

        if (this.observable) {
            this.observable.next();
        }
    }

    isValid() {
        if (this.getControl().touched) {
            if (this.isRequired()) {
                if (this.getControl().value instanceof Array) {
                    return this.getControl().value.length > 0;
                } else {
                    return this.getControl().value !== null;
                }
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    private filterOptionsIfNeeded(options: SelectData[]): SelectData[] {
        if (this.unique) {
            options = this.unique(this, options);
        }

        return options;
    }

    private setValueIfSingleOptionAndRequired() {
        if (this.options.length === 1
            && this.isRequired()
            && this.getControl().value === null) {
            this.refreshFormValue(this.options);
        }
    }

    private refreshFormValue(value: any, options?: { emitEvent: boolean }): void {
        if (value !== null) {
            if (value instanceof Array) {
                const controlValue = [];
                value.forEach((item) => {
                    controlValue.push({
                        id: item.id ? item.id : null,
                        text: item.text
                    });
                });
                this.getControl().setValue(controlValue, options);
            }
        } else {
            this.getControl().setValue([]);
        }
    }
}
