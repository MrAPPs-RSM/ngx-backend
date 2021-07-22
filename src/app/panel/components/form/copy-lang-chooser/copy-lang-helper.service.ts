import { Injectable } from '@angular/core';
import {Language, LanguageService} from '../../../services/language.service';

export interface LanguageChooser extends Language {
  checked?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CopyLangHelperService {

  public copyToLang = false;
  public currentLang: Language;
  public contentLanguages: LanguageChooser[];

  constructor(private _langService: LanguageService) {
  }

  public setCurrentLang(currentLang: Language): void {
    this.currentLang = currentLang;
    this.contentLanguages = this._langService.getContentLanguages();
    this.contentLanguages.forEach((lang) => {
      lang.checked = !(lang.id !== currentLang.id);
    });
  }

  public toggleAllLanguages(checked: boolean): void {
    this.contentLanguages.forEach((lang) => {
      if (lang.id !== this.currentLang.id) {
        lang.checked = checked;
      }
    });
  }
}
