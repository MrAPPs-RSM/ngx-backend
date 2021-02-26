import {FormControl, FormGroup, AbstractControl, ValidationErrors} from '@angular/forms';
import {FormSettings} from '../../panel/components/form/interfaces/form-settings';
import {LanguageService} from '../../panel/services/language.service';

export default class ErrorBag {
  private _form: FormGroup;
  private _formSettings: FormSettings;
  private _languageService: LanguageService;
  private _errorList: {label: string, message: string}[] = [];
  private _errors: {[key: string]: ValidationErrors |null } = {};

  constructor(form: FormGroup, formSettings: FormSettings, languageService: LanguageService) {
    this._form            = form;
    this._formSettings    = formSettings;
    this._languageService = languageService;
  }

  private _extractErrorsFrom(form: FormGroup, parentKey?: string): void {
    Object.entries(form.controls)
      .forEach(([key, control]: [string, AbstractControl]) => {
          if (control instanceof FormGroup) {
            this._extractErrorsFrom((form.controls[key] as FormGroup), key);
          } else if (control instanceof FormControl && control.errors) {
            if (parentKey) {
              this._errors[parentKey] = {[key]: control.errors};
            } else {
              this._errors[key] = control.errors;
            }
          }
      });
  }

  private _composeErrorsFrom(errors: any, parentKey?: string): void {
    Object.entries(errors)
      .forEach(([key, error]: [string, ValidationErrors]) => {
        if (this.isMultiLangField(key)) {
          this._composeErrorsFrom(error, key);
        } else {
          this._createErrorMessage(error, key, parentKey);
        }
      });

  }

  private _createErrorMessage(obj: ValidationErrors, fieldName: string, parentFieldName: string): void {

    let fieldLabel = fieldName;
    const fieldSet = parentFieldName
      ? this._formSettings.fields[parentFieldName]
      : this._formSettings.fields['base'];
    fieldSet.forEach((field: any) => {
      if (field.key === fieldName && field.label) {
        fieldLabel = field.label;
      }
    });

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

    this._errorList.push({
      label: fieldLabel,
      message: message
    });
  }

  extractErrors() {
    this._extractErrorsFrom(this._form);
  }

  composeErrors() {
    this._composeErrorsFrom(this._errors);
  }

  isMultiLangField(isoCode: string): boolean {
    return this._languageService.getContentLanguageByIsoCode(isoCode) !== null;
  }

  get errorList() {
    return this._errorList;
  }

  hasErrors() {
    return this.errorList.length > 0;
  }

  reset() {
    this._errors = {};
    this._errorList = [];
  }

  computeErrors() {
    this.extractErrors();
    this.composeErrors();
  }
}
