import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    ViewEncapsulation,
    ChangeDetectorRef,
    OnDestroy
} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGeneratorService} from '../../services/form-generator.service';
import {ModalService} from '../../services/modal.service';
import {ApiService, ErrorResponse} from '../../../api/api.service';
import {FormSettings} from './interfaces/form-settings';
import {FormButton} from './interfaces/form-button';
import {Language, LanguageService} from '../../services/language.service';
import {Subscription, Observable} from 'rxjs';
import {formConfig} from './form.config';
import { Location } from '@angular/common';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormComponent implements OnInit, OnDestroy {

    @Input() settings: FormSettings;
    @Input() isExternalForm: boolean;
    @Input() enableAutoSubmit: boolean;
    @Input() isExternalLoading: boolean;
    @Output() response: EventEmitter<any> = new EventEmitter<any>();

    dataStored: boolean;

    public form: FormGroup;
    public isLoading = false;
    public currentLang: any = null;
    public isMultiLangEnabled = false;
    objectKeys = Object.keys;

    // Local validation errors
    errors: any = {}; // Object that re-uses form group structure
    errorsList: any = []; // Array to display errors in a human-readable way

    private _subscription = Subscription.EMPTY;

    valueOfSettingsField(key: string) {
        return this.settings.fields[key];
    }

    constructor(private _formGenerator: FormGeneratorService,
                public _languageService: LanguageService,
                private _modal: ModalService,
                private _router: Router,
                private _apiService: ApiService,
                private _location: Location,
                private _route: ActivatedRoute,
                private _ref: ChangeDetectorRef) {
        this.enableAutoSubmit = false;
    }


    ngOnInit() {
        if (typeof this.settings.onlyView === 'undefined') {
            this.settings.onlyView = false;
        }

        if (typeof this.settings.putFilesOnLanguages === 'undefined') {
            this.settings.putFilesOnLanguages = false;
        }

        this._subscription = this._route.queryParams.subscribe((params: any) => {
            const currentLangFromTable = params.currentLang ? params.currentLang : null;
            this.form = this.setupForms(currentLangFromTable);

            if (this.settings.isEdit) {
                this.loadData();
            }

            this.closeErrors();

            if (params.formParams) {
                const values = JSON.parse(params.formParams);
                const newValues = {};

                for (const key of Object.keys(values)) {
                    newValues[key] = isNaN(values[key]) ? values[key] : parseInt(values[key]);
                }

                this._ref.detectChanges();
                this.form.patchValue(newValues);
            }

            // TODO: remove this after veryfied its unused
            if (params.loadData) {
                const data = JSON.parse(params.loadData);
                this.loadData(null, data.id, data.endpoint);
            }
        });

        this.form.valueChanges.subscribe(
            data => {
                this.dataStored = false;
                //console.log(data);
            }
        );
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    public canDeactivate(): Observable<boolean> | boolean {
        return this._apiService.unauthorized || ((!this.form.dirty || this.dataStored) && !this.isLoading);
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
        if (obj.timetable) {
            message = this._languageService.translate('forms.errors.timetable');
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

    setupForms(currentLang?: string | null): FormGroup {
        this.isMultiLangEnabled = 'en' in this.settings.fields && this._languageService.getContentLanguages().length > 0;

        if (this.isMultiLangEnabled) {
            for (const contentLanguage of this._languageService.getContentLanguages()) {
                if (currentLang) {
                    if (contentLanguage.isoCode === currentLang) {
                        this.currentLang = contentLanguage;
                    }
                } else {
                    if (contentLanguage.isDefault) {
                        this.currentLang = contentLanguage;
                    }
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

                    const listDetailKeys = [];
                    const listDetailsFields = {};

                    const hotSpotKeys = [];
                    let hotSpotFields = [];

                    Object.keys(response).forEach((key) => {
                        this.settings.fields.base.forEach((field) => {
                            if (field.key === key && field.type === formConfig.types.LIST_DETAILS) {
                                listDetailKeys.push(key);
                                listDetailsFields[key] = field.fields;
                            }

                            if (field.key === key && field.type === formConfig.types.HOTSPOT) {
                                hotSpotKeys.push(key);
                                hotSpotFields = field.fields;
                            }
                        });
                    });

                    if (listDetailKeys.length > 0) {
                        listDetailKeys.forEach((key) => {
                            for (let i = 0; i < response[key].length; i++) {
                                (this.form.controls[key] as FormArray).push(
                                    new FormGroup(this._formGenerator.generateFormFields(listDetailsFields[key]))
                                );
                            }
                        });
                    }

                    if (hotSpotKeys.length > 0) {
                        hotSpotKeys.forEach((key) => {
                            for (let i = 0; i < response[key]['hotSpots'].length; i++) {
                                ((this.form.controls[key] as any).controls['hotSpots'] as FormArray).push(
                                    new FormGroup(this._formGenerator.generateFormFields(hotSpotFields))
                                );
                            }
                        });
                    }

                    this.form.patchValue(response);
                })
                .catch((response: ErrorResponse) => {
                    this.isLoading = false;
                    this.response.emit((response));
                });
        }
    }

    onCancel(): void {
        this._location.back();
    }

    onSubmit(): void {
        this.closeErrors();
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

    private fixFiles(value: any): any {
        const components = [];
        this.settings.fields.base.forEach((field) => {
            if (field.type === 'file') {
                components.push(field.key);
            }
        });

        this._languageService.getContentLanguages().forEach((lang: Language) => {
            if (this.settings.fields[lang.isoCode]) {
                this.settings.fields[lang.isoCode].forEach((field) => {
                    if (field.type === 'file') {
                        components.push(field.key);
                    }
                });
            }
        });

        const rawValue = value;

        if (components.length > 0) {
            components.forEach((fileKey) => {
                Object.keys(rawValue).forEach((key) => {
                    if (key === fileKey) {
                        if (rawValue[key]) {
                            const array = [];
                            rawValue[key].forEach((item) => {
                                if (item.id) {
                                    array.push(item.id);
                                }
                            });
                            if (array.length > 0) {
                                rawValue[key] = array.slice();
                            }
                        }
                    }
                });

                this._languageService.getContentLanguages().forEach((lang: Language) => {
                    if (rawValue[lang.isoCode]) {
                        Object.keys(rawValue[lang.isoCode]).forEach((key) => {
                            if (key === fileKey) {
                                console.log(rawValue[lang.isoCode][key]);
                                if (rawValue[lang.isoCode][key]) {
                                    const array = [];
                                    rawValue[lang.isoCode][key].forEach((item) => {
                                        if (item.id) {
                                            array.push(item.id);
                                        }
                                    });
                                    if (array.length > 0) {
                                        rawValue[lang.isoCode][key] = array.slice();
                                    }
                                }
                            }
                        });
                    }
                });
            });
        }

        return rawValue;
    }

    submit(): void {
        /** Using getRawValue() because form.value is not changed when FormArray order changes
         *  Useful to support drag&drop on list detail */
        const value = this.fixFiles(this.form.getRawValue());

        console.log(value);

        if (value['geosearch']) { // TODO: valutare se fare meglio
            delete value['geosearch'];
        }

        this.isLoading = true;
        if (this.settings.isEdit) {

            let endpoint = this.settings.submit && this.settings.submit.endpoint ?
                this.settings.submit.endpoint : this.settings.api.endpoint;

            const id = this._route.snapshot.params['id'];
            if (id) {
                endpoint = endpoint + '/' + id;
            }

            this._apiService.patch(endpoint, value)
                .then((response) => {
                    this.isLoading = false;
                    this.dataStored = true;
                    this.response.emit(response);

                    if (response != null && this.settings.submit && this.settings.submit.refreshAfter === true) {
                        this.loadData(response);
                    }
                })
                .catch((response: ErrorResponse) => {
                    this.isLoading = false;
                    this.response.emit(response);
                });
        } else {
            this._apiService.put(this.settings.api.endpoint, value)
                .then((response) => {
                    this.isLoading = false;
                    this.dataStored = true;
                    this.response.emit(response);

                    if (this.settings.submit && this.settings.submit.refreshAfter) {
                        this.loadData(response);
                    }
                })
                .catch((response: ErrorResponse) => {
                    this.isLoading = false;
                    this.response.emit(response);
                });
        }
    }

    closeErrors(): void {
        this.settings.errors = [];
        this.errors = {};
        this.errorsList = [];
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
            let queryParams;
            if (button.config.isTablePath) {
                let buttonParams = button.config.params;
                if (button.config.params.indexOf(':id') > -1) {
                    buttonParams = button.config.params.toString().replace(':id', this._route.snapshot.params['id']);
                }
                if (button.config.titleField && path.indexOf(':title') !== -1) {
                    let titleValue = '---';
                    const titleField: AbstractControl = this.form.get(button.config.titleField);
                    if (titleField && titleField.value !== null && titleField.value !== '') {
                        titleValue = titleField.value;
                    }
                    path = path.replace(':title', titleValue);
                }
                queryParams = {
                    listParams: buttonParams
                };
            }
            this._router.navigate(['../' + path], {queryParams: queryParams, relativeTo: this._route.parent});
        }
        // TODO: implement same logic like action parsing in table.component.ts
    }

}
