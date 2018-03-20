import {Component, Input, OnInit, Output, EventEmitter, ViewEncapsulation, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGeneratorService} from '../../services/form-generator.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ModalService} from '../../services/modal.service';
import {ApiService} from '../../../api/api.service';
import {FormSettings} from './interfaces/form-settings';
import {FormButton} from './interfaces/form-button';
import {Language, LanguageService} from '../../services/language.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormComponent implements OnInit, OnDestroy {

    @Input() settings: FormSettings;
    @Input() isExternalForm: boolean;
    @Input() isExternalLoading: boolean;
    @Output() response: EventEmitter<any> = new EventEmitter<any>();

    public form: FormGroup;
    public isLoading = false;
    public currentLang: any = null;
    public isMultiLangEnabled = false;
    objectKeys = Object.keys;


    // Local validation errors
    private errors: any = {}; // Object that re-uses form group structure
    private errorsList: any = []; // Array to display errors in a human-readable way

    private _subscription = Subscription.EMPTY;

    valueOfSettingsField(key: string) {
        return this.settings.fields[key];
    }

    constructor(private _formGenerator: FormGeneratorService,
                public _languageService: LanguageService,
                private _modal: ModalService,
                private _router: Router,
                private _apiService: ApiService,
                private _route: ActivatedRoute,
                private _ref: ChangeDetectorRef) {
    }


    ngOnInit() {
        this._subscription = this._route.queryParams.subscribe((params: any) => {
            this.form = this.setupForms();

            if (this.settings.isEdit) {
                this.loadData();
            } else {
                if (params.formParams) {

                    const values = JSON.parse(params.formParams);
                    const newValues = {};

                    for (const key of Object.keys(values)) {
                        newValues[key] = isNaN(values[key]) ? values[key] : parseInt(values[key]);
                    }

                    this._ref.detectChanges();
                    this.form.patchValue(newValues);
                }

                if (params.loadData) {
                    const data = JSON.parse(params.loadData);
                    this.loadData(null, data.id, data.endpoint);
                }
            }
        });

        //  const params = this._route.snapshot.queryParams;


        this.form.valueChanges.subscribe(
           data => {
                   console.log(data);
          }
        );
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    private _extractErrors(form: FormGroup, parentKey?: string): void {
        Object.keys(form.controls).forEach((key) => {
            if (form.controls[key] instanceof FormControl) {
                if (form.controls[key].errors) {
                    if (parentKey) {
                        this.errors[parentKey] = {};
                        this.errors[parentKey][key] = form.controls[key].errors;
                    } else {
                        this.errors[key] = form.controls[key].errors;
                    }
                }
            } else if (form.controls[key] instanceof FormGroup) {
                this._extractErrors((form.controls[key] as FormGroup), key);
            }
        });
    }

    private _createErrorMessage(obj: any, fieldName: string, parentFieldName: string): void {
        let fieldLabel = fieldName;
        if (parentFieldName) {
            this.settings.fields[parentFieldName].forEach((field: any) => {
                if (field.key === fieldName && field.label) {
                    fieldLabel = field.label;
                }
            });
        } else {
            this.settings.fields['base'].forEach((field: any) => {
                if (field.key === fieldName && field.label) {
                    fieldLabel = field.label;
                }
            });
        }

        let message = '';

        // TODO: handle different errors if necessary

        if (obj.required) {
            message = this._languageService.translate('forms.errors.required');
        }
        if (obj.max) {
            message = this._languageService.translate('forms.errors.max') + obj.requiredValue;
        }
        if (obj.min) {
            message = this._languageService.translate('forms.errors.min') + obj.requiredValue;
        }

        this.errorsList.push({
            label: fieldLabel,
            message: message
        });
    }

    private _composeErrors(errors: any, parentKey?: string): void {
        Object.keys(errors).forEach((key) => {
            if (this.isMultiLangField(key)) {
                this._composeErrors(errors[key], key);
            } else {
                this._createErrorMessage(errors[key], key, parentKey);
            }
        });
    }

    setupForms(): FormGroup {
        // TODO: is 'en' really required ?
        this.isMultiLangEnabled = 'en' in this.settings.fields && this._languageService.getContentLanguages().length > 0;

        if (this.isMultiLangEnabled) {
            for (const contentLanguage of this._languageService.getContentLanguages()) {

                if (contentLanguage.isDefault) {
                    this.currentLang = contentLanguage;
                }
            }
        }

        return this._formGenerator.generate(this.settings.fields);
    }

    isMultiLangField(isoCode: string): boolean {
        return this._languageService.getContentLanguageByIsoCode(isoCode) !== null;
    }

    onLanguageChange(language: Language) {
        this.currentLang = language;
    }


    /**
     * Loads entity into the form
     *
     * @param entity Useful for GET after submit if entity has changed in server
     * @param _id Useful for duplication
     * @param _endpoint Useful for duplication if edit endpoint different than create
     */
    loadData(entity?: any, _id?: any, _endpoint?: string): void {
        let id = null;

        if (_id) {
            id = _id;
        } else if (this._route.snapshot.params && this._route.snapshot.params['id']) {
            id = this._route.snapshot.params['id'];
        } else if (entity) {
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

            const endpoint = _endpoint ? _endpoint : this.settings.api.endpoint;

            this._apiService.get(
                endpoint + '/' + id, params)
                .then((response) => {
                    this.isLoading = false;
                    this.form.patchValue(response);
                })
                .catch((response: HttpErrorResponse) => {
                    this.isLoading = false;
                    this.response.emit((response));
                });
        }
    }

    onSubmit(): void {
        this.closeErrors(false);
        if (this.isExternalForm) {
            /** If is external form, the component will handle the request */
            this.response.emit(this.form.value);
        } else {
            if (this.form.valid) {
                if (this.settings.submit && this.settings.submit.confirm) {
                    this._modal.confirm()
                        .then(() => {
                            this.submit();
                        })
                        .catch(() => {
                        });
                } else {
                    this.submit();
                }
            } else {
                this._extractErrors(this.form);
                this._composeErrors(this.errors);
            }
        }
    }

    submit(): void {
        /** Using getRawValue() because form.value is not changed when FormArray order changes
         *  Useful to support drag&drop on list detail */
        const value = this.form.getRawValue();
        this.isLoading = true;
        if (this.settings.isEdit) {
            this._apiService.patch(this.settings.api.endpoint + '/' + this._route.snapshot.params['id'], value)
                .then((response) => {
                    this.isLoading = false;
                    this.response.emit(response);

                    if (this.settings.submit && this.settings.submit.refreshAfter === true) {
                        this.loadData(response);
                    }
                })
                .catch((response: HttpErrorResponse) => {
                    this.isLoading = false;
                    this.response.emit(response);
                });
        } else {
            this._apiService.put(this.settings.api.endpoint, value)
                .then((response) => {
                    this.isLoading = false;
                    this.response.emit(response);

                    if (this.settings.submit && this.settings.submit.refreshAfter) {
                        this.loadData(response);
                    }
                })
                .catch((response: HttpErrorResponse) => {
                    this.isLoading = false;
                    this.response.emit(response);
                });
        }
    }

    closeErrors(apiErrors?: boolean): void {
        if (apiErrors) {
            this.settings.errors = [];
        } else {
            this.errors = {};
            this.errorsList = [];
        }
    }

    onButton(button: FormButton): void {
        this.parseButton(button);
    }

    private parseButton(button: FormButton): void {
        if (button.config.path) {
            let path = button.config.path;
            if (path.charAt(0) !== '/') {
                path = 'panel/' + path;
            }
            this._router.navigate([path]);
        }
        // TODO: if necessary, implement same logic like action parsing in table.component.ts
    }

}
