import {Pipe, PipeTransform} from '@angular/core';
import {LanguageService} from '../../panel/services/language.service';

@Pipe({
    name: 'translate',
    pure: false
})
export class TranslatePipe implements PipeTransform {

    constructor(private _languageService: LanguageService) {}

    transform(value: any, args?: any): any {
        return this._languageService.translate(value);
    }
}
