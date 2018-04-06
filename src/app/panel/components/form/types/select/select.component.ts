import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService, ErrorResponse} from '../../../../../api/api.service';
import {ActivatedRoute} from '@angular/router';
import {FormFieldSelect} from '../../interfaces/form-field-select';
import {BaseInputComponent} from '../base-input/base-input.component';
import {Subject} from 'rxjs/Subject';
import {Language, LanguageService} from '../../../../services/language.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SelectComponent extends BaseInputComponent implements OnInit, OnDestroy {

    @Input() field: FormFieldSelect;
    @Input() isEdit: boolean;
    @Input() unique?: Function;

    endpoint: string;
    params = {
        where: {
            and: []
        }
    };
    observable: Subject<any>;
    public options: SelectData[] = [];
    public selected: any;

    private _subscription = Subscription.EMPTY;
    private _subFieldSubscription = Subscription.EMPTY;

    constructor(private _apiService: ApiService,
                private _languageService: LanguageService,
                private _route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.selected = this.field.multiple === true ? [] : {};
        this.addQueryParams();

        this.loadOptions().then(() => {
            if (this.isEdit) {
                this.updateSelectedOptions(this.getControl().value);
                this.refreshFormValue(this.getControl().value);

                if (this.isSubField) {
                    this._subFieldSubscription = this.getControl().parent.valueChanges.subscribe((value) => {
                        if (value && value[this.field.key]) {
                            this.updateSelectedOptions(value[this.field.key]);
                            this._subFieldSubscription.unsubscribe();
                        }
                    });
                }
            }
        }).catch((err) => console.log(err));

        /** Check for changes after load to handle different logic */
        this._subscription = this.getControl().valueChanges.skip(this.isEdit ? 1 : 0).subscribe((value) => {
            if (this.field.multiple === true) {
                if (value !== null && !(value instanceof Array)) {
                    value = [value];
                }
            }

            if (value instanceof Array && value.length > 0) {
                if ((value[0] instanceof Object)) {

                    const newValues = [];

                    for (const val of value) {
                        newValues.push(val.id);
                    }

                    this.getControl().setValue(newValues);
                } else {
                    this.loadOptions(false).then(() => {
                        this.updateSelectedOptions(value);
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            }
        });

        if (this.field.dependsOn) {
            this.field.dependsOn.forEach((key) => {
                if (key instanceof Subject) {
                    this.observable = key as Subject<any>;
                    this.observable.subscribe((value) => {

                        this.loadOptions(true)
                            .then(() => {
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    });
                } else {
                    if (this.form.controls[key]) {
                        this.form.controls[key].valueChanges.subscribe((value) => {
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
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        });
                    }
                }
            });
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

    addQueryParams(): void {
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

    get isValid() {
        if (this.getControl().touched) {
            if (this.isRequired()) {
                if (this.field.multiple === true) {
                    if (this.getControl().value instanceof Array) {
                        return this.getControl().value.length > 0;
                    } else {
                        return this.getControl().value !== null;
                    }
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

    private updateSelectedOptions(value: any) {
        if (value) {
            if (this.field.multiple === true) {
                value.forEach((itemId) => {
                    if (typeof itemId === 'object') {
                        itemId = itemId.id;
                    }
                    this.options.forEach((option) => {
                        if (option.id === itemId) {
                            this.selected.push({
                                id: itemId,
                                text: option.text
                            });
                        }
                    });
                });
                this.selected = [...this.selected];
            } else {
                this.options.forEach((option) => {
                    if (typeof value === 'object') {
                        if (option.id === value.id) {
                            this.selected = {
                                id: value.id,
                                text: option.text
                            };
                        }
                    } else {
                        if (option.id === value) {
                            this.selected = {
                                id: value,
                                text: option.text
                            };
                        }
                    }
                });
            }
        } else {
           this.selected = this.field.multiple === true ? [] : null;
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

    onChange($event): void {
        this.refreshFormValue($event);

        if (this.observable) {
            this.observable.next();
        }
    }

    private refreshFormValue(value): void {
        if (value !== null) {
            if (value instanceof Array) {
                const ids = [];
                value.forEach((item) => {
                    ids.push(item instanceof Object ? item.id : item);
                });
                this.getControl().setValue(ids);
            } else {
                if (typeof value === 'object') {
                    this.getControl().setValue(value.id);
                } else {
                    this.getControl().setValue(value);
                }
            }
        } else {
            this.getControl().setValue(null);
        }
    }
}

export interface SelectData {
    id: string | number;
    text: string;
}
