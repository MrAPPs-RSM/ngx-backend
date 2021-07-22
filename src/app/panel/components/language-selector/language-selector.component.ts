import { Component, Input, Output, EventEmitter } from '@angular/core';
import {LanguageService} from '../../services/language.service';


@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent {
  @Input() selectedLang: string;
  @Output() selectedLangChange = new EventEmitter<string>();
  constructor(public languageService: LanguageService) { }

  emitChange(lang: string) {
    this.selectedLangChange.emit(lang);
  }
}
