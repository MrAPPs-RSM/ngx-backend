import { Injectable } from '@angular/core';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { environment } from '../../../environments/environment';
import { translations } from '../../../translations';

@Injectable()
export class LanguageService {

    private backendLanguages: Language[];
    private contentLanguages: Language[];

    public static getLocaleCodeFromLang(lang: any): string {
        let locale = lang;
        switch (lang) {
            case 'en': {
                locale = 'en-US';
            }
                break;
            case 'it': {
                locale = 'it-IT';
            }
                break;
        }

        return locale;
    }

    constructor(private _dateTimeAdapter: DateTimeAdapter<any>) {
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

            this.setDatePickerLocale();
        }
    }

    public setDatePickerLocale(): void {
        /** Changing date picker locale */
        this._dateTimeAdapter.setLocale(LanguageService.getLocaleCodeFromLang(environment['currentLang']));
    }

    public removeLang(): void {
        localStorage.removeItem('lang');
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
        const array = value.split('.');
        let res = translations[isoCode ? isoCode : (environment['currentLang'] ? environment['currentLang'] : 'it')];
        array.forEach((item) => {
            res = res[item];
        });

        return res;
    }

    public setCurrentContentTableLang(language: Language | string): void {
        if (this.isMultiLang()) {
            let lang = language;
            if (typeof language === 'string') {
                lang = this.getBackendLanguageByIsoCode(language);
            }

            localStorage.setItem('table_lang', JSON.stringify(lang));
        }
    }

    public getCurrentContentTableLang(): Language {
        if (this.isMultiLang()) {

            const contentLang = localStorage.getItem('table_lang');

            if (contentLang !== null) {
                return JSON.parse(contentLang);
            }
        }
        return null;
    }
}

export interface Language {
    id?: number;
    name: string;
    isoCode: string;
    isDefault?: boolean;
}
