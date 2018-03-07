import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {translations} from '../../../translations';

@Injectable()
export class LanguageService {

    private backendLanguages: Language[];
    private contentLanguages: Language[];

    constructor() {
        this.backendLanguages = environment.hasOwnProperty('languages') ? environment['languages'] : [];
    }

    public isMultiLang() {
        return this.backendLanguages.length > 0 && environment.hasOwnProperty('currentLang');
    }

    public setCurrentLang(language: Language | string): void {
        if (this.isMultiLang()) {
            let lang = language;
            if (typeof language === 'string') {
                lang = this.getBackendLanguageByIsoCode(language);
            }

            environment['currentLang'] = (lang as Language).isoCode;

            localStorage.setItem('lang', JSON.stringify(lang));
        }
    }

    public getCurrentLang(): Language {
        if (this.isMultiLang()) {
            return JSON.parse(localStorage.getItem('lang'));
        }
        return null;
    }

    public getBackendLanguages(): Language[] {
        return this.backendLanguages;
    }

    public setContentLanguages(languages: Language[]): void {
        this.contentLanguages = languages;
    }

    public getContentLanguages(): Language[] {
        return this.contentLanguages;
    }

    public getIsoCodeForFlag(language: Language): string {
        return language.isoCode !== 'en' ? language.isoCode : 'gb';
    }

    public getBackendLanguageByIsoCode(isoCode: string): Language | null {
        return this.getByIsoCode(this.backendLanguages, isoCode);
    }

    public getContentLanguageByIsoCode(isoCode: string): Language | null {
        return this.getByIsoCode(this.contentLanguages, isoCode);
    }

    private getByIsoCode(languages: Language[], isoCode: string): Language | null {
        for (const language of languages) {
            if (language.isoCode === isoCode) {
                return language;
            }
        }

        return null;
    }

    translate(value: any, isoCode?: string) {
        if (this.isMultiLang()) {
            const array = value.split('.');
            let res = translations[isoCode ? isoCode : environment['currentLang']];
            array.forEach((item) => {
                res = res[item];
            });
            return res;
        }

        return value;
    }
}

export interface Language {
    id?: number;
    name: string;
    isoCode: string;
    isDefault?: boolean;
}
