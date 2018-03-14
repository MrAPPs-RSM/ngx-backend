import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../../../../../api/api.service';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {FormFieldSelect} from '../../interfaces/form-field-select';
import {BaseInputComponent} from '../base-input/base-input.component';
import {Subject} from 'rxjs/Subject';
import {LanguageService} from '../../../../services/language.service';
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
    params = {};
    observable: Subject<any>;
    public options: SelectData[] = [];
    public selected: any; // Array or object


    private _subscription = Subscription.EMPTY;

    constructor(private _apiService: ApiService,
                private _languageService: LanguageService,
                private _route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.selected = this.field.multiple === true ? [] : {};

        this._subscription = this.getControl().valueChanges.subscribe((value) => {

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

                    const updatedField = {};
                    updatedField[this.field.key] = newValues;

                    this.form.patchValue(updatedField);
                } else {
                    this.loadOptions(null, false).then(() => {
                        this.updateSelectedOptions(value);

                    }).catch((err) => {
                        console.log(err);
                    });
                }
            }
        });

        this.loadData();

        if (this.field.dependsOn) {
            this.field.dependsOn.forEach((key) => {

                if (key instanceof Subject) {
                    this.observable = key as Subject<any>;
                    this.observable.subscribe((value) => {

                        this.loadOptions(this.params)
                            .then(() => {
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    });
                } else {
                    if (this.form.controls[key]) {
                        this.form.controls[key].valueChanges.subscribe((value) => {
                            this.params[key] = value;
                            this.loadOptions(this.params)
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
        this._subscription.unsubscribe();
    }

    get isValid() {
        if (this.getControl().touched) {
            if (this.field.validators && this.field.validators.required) {
                if (this.field.multiple) {
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

    private updateSelectedOptions(value) {
        value.forEach((itemId) => {
            this.options.forEach((option) => {

                if (option.id === itemId) {
                    this.selected.push({
                        id: itemId,
                        text: option.text
                    });
                }
            });
            this.selected = [...this.selected];
        });
    }

    private loadData(): void {
        this.loadOptions().then(() => {
        }).catch((err) => console.log(err));
    }

    private filterOptionsIfNeeded(options: SelectData[]): SelectData[] {
        if (this.unique) {
            options = this.unique(this, options);
        }

        return options;
    }

    private setValueIfSingleOptionAndRequired() {
        if (this.options.length === 1
            && this.field.validators
            && this.field.validators.required
            && this.getControl().value === null) {
            this.refreshFormValue(this.options);
        }
    }

    private loadOptions(params?: any, forceReload?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.field.options) {
                if (this.field.options instanceof Array) {

                    if (this.options == null || forceReload === null || forceReload === true) {
                        this.options = this.filterOptionsIfNeeded(this.field.options);
                    }
                    this.setValueIfSingleOptionAndRequired();
                    resolve();
                } else {
                    if (this.options.length === 0 || forceReload === null || forceReload === true) {
                        let endpoint = this.field.options;

                        if (this.isEdit) {
                            if (endpoint.indexOf(':id') !== -1) {
                                endpoint = endpoint.replace(':id', this._route.params['value'].id);
                            }
                        }

                        /** Add lang if not set by setup.json */
                        let lang: any = null;
                        if (endpoint.indexOf('lang=') === -1) {
                            lang = this._languageService.getCurrentLang();
                        }

                        if (lang) {
                            if (params) {
                                params.lang = lang['isoCode'];
                            } else {
                                params = {
                                    lang: lang['isoCode']
                                };
                            }
                        }

                        this._apiService.get(endpoint, params)
                            .then((response) => {
                                this.options = this.filterOptionsIfNeeded(response);
                                this.setValueIfSingleOptionAndRequired();
                                resolve();
                            })
                            .catch((response: HttpErrorResponse) => {
                                // TODO: decide what to do if select options can't be loaded (back to prev page?, alert?, message?)
                                console.log(response.error);
                            });
                    } else {
                        resolve();
                    }
                }
            } else {
                reject();
            }
        });
    }

    onChange($event): void {
        if (this.field.multiple) {
            this.refreshFormValue($event);
        }

        if (this.observable != null) {
            this.observable.next();
        }
    }

    private refreshFormValue(values): void {
        if (values != null) {
            if (values instanceof Array) {
                const ids = [];
                values.forEach((item) => {
                    ids.push(item instanceof Object ? item.id : item);
                });
                this.getControl().setValue(ids);
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
