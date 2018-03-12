import {Component, Input, OnInit, ViewEncapsulation, OnDestroy, OnChanges} from '@angular/core';
import {ApiService} from '../../../../../api/api.service';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {FormFieldSelect} from '../../interfaces/form-field-select';
import {BaseInputComponent} from '../base-input/base-input.component';
import {Subject} from 'rxjs/Subject';
import {LanguageService} from '../../../../services/language.service';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SelectComponent extends BaseInputComponent implements OnInit, OnChanges {

    @Input() field: FormFieldSelect;
    @Input() isEdit: boolean;
    @Input() unique?: Function;
    params = {};
    observable: Subject<any>;
    public options: SelectData[] = [];
    public selected: any; // Array or object


    constructor(private _apiService: ApiService,
                private _languageService: LanguageService,
                private _route: ActivatedRoute) {
        super();
    }

    ngOnChanges() {

    }

    ngOnInit() {
        this.loadData();

        this.selected = this.field.multiple === true ? [] : {};

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
        if (value !== null && !(value instanceof Array)) {
            value = [value];
        }

        if (value instanceof Array) {
            value.forEach((item) => {
                this.options.forEach((option) => {

                    const itemId = item instanceof Object ? item.id : item;

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
        this.refreshFormValue();
    }

    private loadData(): void {
        if (this.field.multiple) {
            this.getControl().valueChanges.first().subscribe((value) => {
                console.log("VALUES: "+value)
                this.loadOptions().then(() => {
                    this.updateSelectedOptions(value);

                }).catch((err) => {
                    console.log(err);
                });
            });
        }

        this.loadOptions().then( () => {
            if (this.field.multiple) {
                this.updateSelectedOptions(this.getControl().value);
            }
        }).catch((err) => console.log(err));
    }

    private filterOptionsIfNeeded(options: SelectData[]): SelectData[] {
        if (this.unique) {
            options = this.unique(this, options);
        }

        return options;
    }

    private loadOptions(params?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.field.options) {
                if (this.field.options instanceof Array) {
                    this.options = this.filterOptionsIfNeeded(this.field.options);
                    resolve();
                } else {

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
                            resolve();
                        })
                        .catch((response: HttpErrorResponse) => {
                            // TODO: decide what to do if select options can't be loaded (back to prev page?, alert?, message?)
                            console.log(response.error);
                        });
                }
            } else {
                reject();
            }
        });
    }

    onChange($event): void {
        if (this.field.multiple) {
            this.selected = $event;
            this.refreshFormValue();
        }

        if (this.observable != null) {
            this.observable.next();
        }
    }

    private refreshFormValue(): void {
        if (this.selected) {
            if (this.selected instanceof Array) {
                const ids = [];
                this.selected.forEach((item) => {
                    ids.push(item.id);
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
