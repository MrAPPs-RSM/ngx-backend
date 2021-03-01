import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Language, LanguageService} from '../../services/language.service';


@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent {
  @Input() selectedLang: string;
  @Output() selectedLangChange = new EventEmitter<string>();
  constructor(public _languageService: LanguageService) { }

  emitChange(lang: Language) {
    if (lang.isoCode === this.selectedLang) {
      return;
    }
    this.selectedLangChange.emit(lang.isoCode);
  }

  get currentLanguage() {
    return this._languageService.getContentLanguages().find((e: Language) => e.isoCode == this.selectedLang);
  }
}
