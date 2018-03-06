import {Pipe, PipeTransform} from '@angular/core';
import {translations} from '../../../translations';
import {environment} from '../../../environments/environment';

@Pipe({
    name: 'translate',
    pure: false
})
export class TranslatePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        const array = value.split('.');
        let res = translations[environment.currentLang];
        array.forEach((item) => {
            res = res[item];
        });
        return res;
    }
}
