import {Component, Input, OnInit, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {formConfig} from './form.config';
import {FormGeneratorService} from '../../services/form-generator.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ModalService} from '../../services/modal.service';
import {ApiService} from '../../../api/api.service';
import {FormConfiguration} from './interfaces/form-configuration';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormComponent implements OnInit {

    @Input() config: FormConfiguration;
    @Input() isLoginLoading: boolean;
    @Output() response: EventEmitter<any> = new EventEmitter<any>();

    public form: FormGroup;
    public formConfig = formConfig;
    public isLoading = false;
    public previousLang: any = null;
    public currentLang: any = null;
    public formGroupModels: any;

    constructor(private _formGenerator: FormGeneratorService,
                private _modal: ModalService,
                private _apiService: ApiService,
                private _route: ActivatedRoute) {
    }

    setupForms(): FormGroup {

        let currentForm: FormGroup;

        if (this._formGenerator.contentLanguages.length > 0) {
            this.formGroupModels = {};

            for (const contentLanguage of this._formGenerator.contentLanguages) {

                const model = {};

                for (const field of this.config.fields) {

                    if (field.type === 'lat_lng') {
                        model[field['lng'].key] = 0.0;
                        model[field['lat'].key] = 0.0;
                    } else {
                        model[field.key] = null;
                    }
                }

                this.formGroupModels[contentLanguage.isoCode] = model;

                if (contentLanguage.isDefault) {
                    this.previousLang = contentLanguage;
                    this.currentLang = contentLanguage;
                }
            }
        }

        currentForm = this._formGenerator.generate(this.config.fields);

        return currentForm;
    }

    isMultiLangEnabled() {
       return this._formGenerator.contentLanguages.length > 0;
    }

    getLanguageForIsoCode(isoCode: string): any {
        for (const language of this._formGenerator.contentLanguages) {
            if (language.isoCode === isoCode) {
                return language;
            }
        }
    }

    onLanguageChange(newValue) {

        this.formGroupModels[this.previousLang.isoCode] = this.form.getRawValue();

        this.currentLang = this.getLanguageForIsoCode(newValue);
        this.previousLang = this.currentLang;

        this.form.patchValue(this.formGroupModels[this.currentLang.isoCode]);
    }

    getLanguages(){
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
            });

        if (this.config.isEdit) {
            this.loadData();
        }
    }


    loadData(): void {
        if (this._route.snapshot.params && this._route.snapshot.params['id']) {
            this.isLoading = true;

            let params = {};
            if (this.config.api.filter) {
                params = {
                    filter: this.config.api.filter
                };
            }
            this._apiService.get(
                this.config.api.endpoint + '/' + this._route.snapshot.params['id'], params)
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
        if (this.config.isLoginForm) {
            /** If is login form, the login component will handle the request */
            this.response.emit(this.form.value);
        } else {
            if (this.form.valid) {
                if (this.config.confirm) {
                    this.modalSubmit();
                } else {
                    this.directSubmit();
                }
            }
        }
    }

    modalSubmit(): void {
        this._modal.confirm()
            .then(() => {
                this.isLoading = true;
                if (this.config.isEdit) {
                    this._apiService.patch(this.config.api.endpoint + '/' + this._route.snapshot.params['id'], this.form.value)
                        .then((response) => {
                            this.isLoading = false;
                            this.response.emit(response);
                        })
                        .catch((response: HttpErrorResponse) => {
                            this.isLoading = false;
                            this.response.emit(response);
                        });
                } else {
                    setTimeout(() => {
                        this._apiService.put(this.config.api.endpoint, this.form.value)
                            .then((response) => {
                                this.isLoading = false;
                                this.response.emit(response);
                            })
                            .catch((response: HttpErrorResponse) => {
                                this.isLoading = false;
                                this.response.emit(response);
                            });
                    }, 5000);
                }
            })
            .catch(() => {
            });
    }

    directSubmit(): void {
        this.isLoading = true;
        if (this.config.isEdit) {
            this._apiService.patch(this.config.api.endpoint + '/' + this._route.snapshot.params['id'], this.form.value)
                .then((response) => {
                    this.isLoading = false;
                    this.response.emit(response);
                })
                .catch((response: HttpErrorResponse) => {
                    this.isLoading = false;
                    this.response.emit(response);
                });
        } else {
            this._apiService.put(this.config.api.endpoint, this.form.value)
                .then((response) => {
                    this.isLoading = false;
                    this.response.emit(response);
                })
                .catch((response: HttpErrorResponse) => {
                    this.isLoading = false;
                    this.response.emit(response);
                });
        }
    }
}
