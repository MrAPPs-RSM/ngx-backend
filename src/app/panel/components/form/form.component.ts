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
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGeneratorService } from '../../services/form-generator.service';
import { ModalService } from '../../services/modal.service';
import { ApiService, ErrorResponse } from '../../../api/api.service';
import { FormSettings } from './interfaces/form-settings';
import { FormButton } from './interfaces/form-button';
import { Language, LanguageService } from '../../services/language.service';
import { Subscription, Observable } from 'rxjs';
import { Location } from '@angular/common';
import ErrorBag from '../../../strategies/form/ErrorBag';
import ResponseProcessor from '../../../strategies/form/ResponseProcessor';
import RequestProcessor from '../../../strategies/form/RequestProcessor';

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

    errorBag: ErrorBag;
    processor: ResponseProcessor;
    requestProcessor: RequestProcessor;

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

            this.errorBag = this._languageService.createErrorBagFor(this.form, this.settings);
            this.processor = this._formGenerator.generateResponseProcessorFor(this.form, this.settings);
            this.requestProcessor = new RequestProcessor(this.settings, this._languageService);
            this.closeErrors();

            if (params.formParams) {
                const values = JSON.parse(params.formParams);
                const newValues = {};

                for (const key of Object.keys(values)) {
                    newValues[key] = isNaN(values[key]) ? values[key] : parseInt(values[key], 10);
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
            }
        );
    }

    isFormLoading() {
      return this.isLoading || this.isExternalLoading;
    }

    hasErrors() {
      return (this.settings.errors && this.settings.errors.length > 0) || this.errorBag.hasErrors();
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    public canDeactivate(): Observable<boolean> | boolean {
        return this._apiService.unauthorized || ((!this.form.dirty || this.dataStored) && !this.isLoading);
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
        this.isLoading = true;

        let params = {};
        if (this.settings.api.filter) {
            for (const key of Object.keys(this.settings.api.filter)) {
                params = {
                    ...params,
                    [key]: this.settings.api.filter[key]
                };
            }
        }

        const endpoint = _endpoint ? _endpoint : this.settings.api.endpoint;

        this._apiService.get(
            endpoint + (id !== null ? '/' + id : ''), params)
            .then((response) => {
                this.isLoading = false;
                this.processor.syncResponse(response);
                this.form.patchValue(response);
            })
            .catch((response: ErrorResponse) => {
                this.isLoading = false;
                this.response.emit((response));
            });

    }

    onCancel(): void {
        this._location.back();
    }

    onSubmit(): void {
        this.closeErrors();
        if (this.isExternalForm) {
            this.response.emit(this.form.value);
        } else if (false === this.form.valid) {
          this.errorBag.computeErrors();

        } else if (this.settings.submit && this.settings.submit.confirm) {
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

    postEditResponse(response: any): void {
      this.isLoading = false;
      this.dataStored = true;
      this.response.emit(response);

      if (response != null && this.settings.submit && this.settings.submit.refreshAfter === true) {
        this.loadData(response);
      } else {
        this._location.back();
      }
    }

    postCreateResponse(response: any): void {
      this.isLoading = false;
      this.dataStored = true;
      this.response.emit(response);

      if (this.settings.submit && (this.settings.submit.refreshAfter || this.settings.submit.redirectAfter)) {
        if (this.settings.submit.refreshAfter) {
          this.loadData(response);
        } else if (this.settings.submit.redirectAfter) {
          this._router.navigateByUrl('/panel/' + this.settings.submit.redirectAfter);
        }
      } else {
        this._location.back();
      }
    }

    checkProgressStatus(response: any, fromEdit: boolean): void {
      if ('progress_status' in response && response['progress_status'] === 'failed') {
        this.isLoading = false;
      } else if ('progress_url' in response) {
        setTimeout(() => {
          this._apiService.get(response['progress_url'])
            .then((progressResponse) => this.checkProgressStatus(progressResponse, fromEdit));
        }, 5000);
      } else {
        if (fromEdit) {
          this.postEditResponse(response);
        } else {
          this.postCreateResponse(response);
        }
      }
    }

    submit(): void {
        /** Using getRawValue() because form.value is not changed when FormArray order changes
         *  Useful to support drag&drop on list detail */
        const value = this.requestProcessor.createFormRequestBody(this.form.getRawValue());

        const manageError = (response: ErrorResponse) => {
          this.isLoading = false;
          this.response.emit(response);
        };

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
                  if ('progress_url' in response) {
                    this.checkProgressStatus(response, true);
                  } else {
                    this.postEditResponse(response);
                  }
                })
                .catch(manageError);
        } else {
            this._apiService.put(this.settings.api.endpoint, value)
                .then((response) => {
                  if ('progress_url' in response) {
                    this.checkProgressStatus(response, false);
                  } else {
                    this.postCreateResponse(response);
                  }
                })
                .catch(manageError);
        }
    }

    closeErrors(): void {
        this.settings.errors = [];
        this.errorBag.reset();
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
            this._router.navigate(['../' + path], { queryParams: queryParams, relativeTo: this._route.parent });
        }
        // TODO: implement same logic like action parsing in table.component.ts
    }

}
