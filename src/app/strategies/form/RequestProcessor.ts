import {FormSettings} from '../../panel/components/form/interfaces/form-settings';
import {Language, LanguageService} from '../../panel/services/language.service';
import {formConfig} from '../../panel/components/form/form.config';

export default class RequestProcessor {
  constructor(protected settings: FormSettings, protected _languageService: LanguageService) {}

  createFormRequestBody(value: any): any {
    const retval = {};
    const rawValues = this.fixFiles(value);

    for (const [key, rawValue] of Object.entries(rawValues)) {
      if (key === 'geocode') {
        continue;
      }

      retval[key] = null === rawValue
        ? ''
        : rawValue;
    }

    return retval;
  }

  protected getKeysToCheck() {
    return [
      'base',
      ...this._languageService.getContentLanguages().map((lang: Language) => lang.isoCode)
    ];
  }

  fixFiles(value: any): any {
    let fileKeys: string[] = [];
    let rawValues = value;
    const keysToCheck = this.getKeysToCheck();

    for (const langKey of keysToCheck) {
      if (!this.settings.fields[langKey]) {
        continue;
      }

      /**
       * Accumulate all keys of file field type
       */
      fileKeys = this.settings.fields[langKey]
        .reduce((acc: [], field: any) => {
          return field.type === formConfig.types.FILE
            ? [...acc, field.key]
            : acc;
        }, fileKeys);
    }

    for (const langKey of keysToCheck) {
      if (langKey !== 'base' && !rawValues[langKey]) {
        continue;
      }

      const ref = langKey !== 'base'
        ? rawValues[langKey]
        : rawValues;

      const fixed = this.filterValues(fileKeys, ref);

      if (langKey !== 'base') {
        rawValues[langKey] = {...fixed};
      } else {
        rawValues = {...rawValues, ...fixed};
      }
    }

    return rawValues;
  }

  private filterValues(fileKeys: string[], values: any) {
    const fixed = {};
    for (const [key, value] of Object.entries(values)) {
      if (!value || false === fileKeys.includes(key)) {
        continue;
      }

      fixed[key] = (value as [])
        .reduce((acc: [], item: any) => {
          return item.id
            ? [...acc, item.id]
            : acc;
        }, []);
    }

    return {...values, ...fixed};
  }
}
