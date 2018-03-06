import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable()
export class LanguageService {

    private languages: Language[];

    constructor() {
        this.languages = [];
    }

    setCurrentLang(language: Language | string): void {
        if (typeof language === 'string') {
            environment.lang = language;
        } else {
            environment.lang = language.isoCode;
        }
    }

    getCurrentLang(): Language {
        return this.getByIsoCode(environment.lang);
    }

    setLanguages(languages: Language[]): void {
        this.languages = languages;
    }

    getLanguages(): Language[] {
        return this.languages;
    }

    getIsoCodeForFlag(language: Language): string {
        return language.isoCode !== 'en' ? language.isoCode : 'gb';
    }

    getByIsoCode(isoCode: string): Language | null {
        for (const language of this.languages) {
            if (language.isoCode === isoCode) {
                return language;
            }
        }

        return null;
    }
}

export interface Language {
    id: number;
    name: string;
    isoCode: string;
    isDefault: boolean;
}
