import RequestProcessor from './RequestProcessor';
import {formConfig} from '../../panel/components/form/form.config';

export default class CalendarRequestProcessor extends RequestProcessor {
  createFormRequestBody(value: any): any {
    const raw = super.createFormRequestBody(value);
    const keys   = super.getKeysToCheck();
    let retval = {};
    let dateKeys: string[] = [];

    for (const langKey of keys) {
      if (!this.settings.fields[langKey]) {
        continue;
      }

      /**
       * Accumulate all keys of file field type
       */
      dateKeys = this.settings.fields[langKey]
        .reduce((acc: [], field: any) => {
          return field.type === formConfig.types.DATE
            ? [...acc, field.key]
            : acc;
        }, dateKeys);
    }

    for (const key of keys) {
      if (key !== 'base' && !raw[key]) {
        continue;
      }

      const data = key === 'base'
        ? raw
        : raw[key];

      const tr = this.transformDates(dateKeys, data);

      retval = key === 'base'
        ? {...retval, ...tr}
        : {...retval, [key]: {...tr}};
    }

    return retval;
  }

  protected transformDates(dateKeys: string[], values: any): any {
    const retval = {};
    for (const [key, value] of Object.entries(values)) {
      if (!value || false === dateKeys.includes(key)) {
        continue;
      }
      const c = new Date(value as string|Date);
      const utc = Date.UTC(
        c.getFullYear(),
        c.getMonth(),
        c.getDate(),
        c.getHours(),
        c.getMinutes(),
        c.getSeconds()
      );
      retval[key] = new Date(utc as any).toISOString();
    }

    return {...values, ...retval};
  }
}
