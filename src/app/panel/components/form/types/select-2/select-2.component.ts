import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {ActivatedRoute} from '@angular/router';
import {Language, LanguageService} from '../../../../services/language.service';
import {ApiService, ErrorResponse} from '../../../../../api/api.service';
import {FormFieldSelect} from '../../interfaces/form-field-select';
import {Subject} from 'rxjs/Subject';
import {SelectData} from '../select/select.component';

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
    private observable: Subject<any>;
    public options: SelectData[] = [];
    public selected: any[] = [];
    private params = {
        where: {
            and: []
        }
    };

    constructor(private _apiService: ApiService,
                private _languageService: LanguageService,
                private _route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.endpoint = this.field.options;
        this.loadOptions().then(() => {}).catch((err) => console.log(err));
    }

    private loadOptions(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.endpoint) {
                if (this.options.length === 0) {
                    const queryParams = {
                        where: JSON.stringify(this.params.where)
                    };
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
                            this.options = response;
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
                    if (this.options.length === 0) {
                        this.options = this.field.options;
                    }
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
