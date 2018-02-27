import {Component, Input, OnInit, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {formConfig} from './form.config';
import {FormGeneratorService} from '../../services/form-generator.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ModalService} from '../../services/modal.service';
import {ApiService} from '../../../api/api.service';
import {FormSettings} from './interfaces/form-settings';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormComponent implements OnInit {

    @Input() settings: FormSettings;
    @Input() isLoginLoading: boolean;
    @Output() response: EventEmitter<any> = new EventEmitter<any>();

    public form: FormGroup;
    public formConfig = formConfig;
    public isLoading = false;
    public previousLang: any = null;
    public currentLang: any = null;
    public formGroupModels: any;
    public isMultiLangEnabled = false;

    constructor(private _formGenerator: FormGeneratorService,
                private _modal: ModalService,
                private _apiService: ApiService,
                private _route: ActivatedRoute) {
    }

    setupForms(): FormGroup {

        let currentForm: FormGroup;

        this.formGroupModels = {};

        let model = {};

        let isMultiLang = false;

        for (const field of this.settings.fields) {
            if (!('multiLang' in field) || !field.multiLang) {
                if (field.type === 'lat_lng') {
                    model[field['lng'].key] = 0.0;
                    model[field['lat'].key] = 0.0;
                } else {
                    model[field.key] = null;
                }
            } else {
                isMultiLang = true;
            }
        }

        this.isMultiLangEnabled = isMultiLang && this._formGenerator.contentLanguages.length > 0;


        if (Object.keys(model).length > 0) {
            this.formGroupModels['base'] = model;
        }

        if (isMultiLang) {
            for (const contentLanguage of this._formGenerator.contentLanguages) {

                model = {};

                for (const field of this.settings.fields) {

                    if (('multiLang' in field) && field.multiLang) {
                        if (field.type === 'lat_lng') {
                            model[field['lng'].key] = 0.0;
                            model[field['lat'].key] = 0.0;
                        } else {
                            model[field.key] = null;
                        }
                    }
                }

                this.formGroupModels[contentLanguage.isoCode] = model;

                if (contentLanguage.isDefault) {
                    this.previousLang = contentLanguage;
                    this.currentLang = contentLanguage;
                }
            }
        }

        currentForm = this._formGenerator.generate(this.settings.fields);

        return currentForm;
    }

    getLanguageForIsoCode(isoCode: string): any {
        for (const language of this._formGenerator.contentLanguages) {
            if (language.isoCode === isoCode) {
                return language;
            }
        }
    }

    updateForms() {

        const modelValue = this.form.getRawValue();

        if ('base' in this.formGroupModels) {
            for (const key of Object.keys(this.formGroupModels['base'])) {
                this.formGroupModels.base[key] = modelValue[key];
                delete modelValue[key];
            }
        }

        this.formGroupModels[this.previousLang.isoCode] = modelValue;
    }

    onLanguageChange(newValue) {

        // TODO: check if current form is valid to store in language model (if (this.form.valid))
        this.updateForms();

        this.currentLang = this.getLanguageForIsoCode(newValue);
        this.previousLang = this.currentLang;

        this.form.patchValue(this.formGroupModels[this.currentLang.isoCode]);
    }

    getLanguages() {
        return this._formGenerator.contentLanguages;
    }

    ngOnInit() {

        for (const language of this._formGenerator.contentLanguages) {
            if (language.isDefault) {
                this.currentLang = language;
                break;
            }
        }

        this.form = this.setupForms();

        this.form.valueChanges.subscribe(
            data => {
                console.log(data);
                // console.log(this.form);
            }
        );
        if (this.settings.isEdit) {

            this.loadData();
        }
    }


    loadData(entity?: any): void {
        let id = null;

        if (this._route.snapshot.params && this._route.snapshot.params['id']) {
            id = this._route.snapshot.params['id'];
        } else {
            id = entity ? entity.id : null;
        }

        if (id !== null) {
            this.isLoading = true;

            let params = {};
            if (this.settings.api.filter) {
                params = {
                    filter: this.settings.api.filter
                };
            }
            this._apiService.get(
                this.settings.api.endpoint + '/' + id, params)
                .then((response) => {
                    this.isLoading = false;
                    Object.keys(response).forEach((key) => {
                        if (this.form.controls[key]) {
                            this.form.controls[key].setValue(response[key]);
                        }
                    });
                })
                .catch((response: HttpErrorResponse) => {
                    this.isLoading = false;
                    this.response.emit((response));
                });
        }
    }

    onSubmit(): void {
        if (this.settings.isLoginForm) {
            /** If is login form, the login component will handle the request */
            this.response.emit(this.form.value);
        } else {
            this.updateForms();

            if (this.form.valid) {
                if (this.settings.submit.confirm) {
                    this._modal.confirm()
                        .then(() => {
                            this.submit();
                        })
                        .catch(() => {
                        });
                } else {
                    this.submit();
                }
            }
        }
    }

    submit(): void {
        this.isLoading = true;
        if (this.settings.isEdit) {
            this._apiService.patch(this.settings.api.endpoint + '/' + this._route.snapshot.params['id'], this.form.value)
                .then((response) => {
                    this.isLoading = false;
                    this.response.emit(response);

                    if (this.settings.submit.refreshAfter === true) {
                        this.loadData(response);
                    }
                })
                .catch((response: HttpErrorResponse) => {
                    this.isLoading = false;
                    this.response.emit(response);
                });
        } else {
            this._apiService.put(this.settings.api.endpoint, this.form.value)
                .then((response) => {
                    this.isLoading = false;
                    this.response.emit(response);

                    if (this.settings.submit.refreshAfter) {
                        this.loadData(response);
                    }
                })
                .catch((response: HttpErrorResponse) => {
                    this.isLoading = false;
                    this.response.emit(response);
                });
        }
    }

    closeErrors(): void {
        this.settings.errors = [];
    }
}
