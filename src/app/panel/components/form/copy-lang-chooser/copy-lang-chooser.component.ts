import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Language, LanguageService} from '../../../services/language.service';
import {CopyLangHelperService} from './copy-lang-helper.service';

@Component({
  selector: 'app-copy-lang-chooser',
  templateUrl: './copy-lang-chooser.component.html',
  styleUrls: ['./copy-lang-chooser.component.scss']
})
export class CopyLangChooserComponent implements OnChanges {

  @Input() currentLang: Language;

  constructor(public copyLangHelper: CopyLangHelperService,
              public langService: LanguageService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.currentLang) {
      this.copyLangHelper.setCurrentLang(this.currentLang);
    }
  }

  public onSelectAllLanguagesChange($event: any): void {
    if (this.currentLang && this.copyLangHelper.copyToLang) {
      this.copyLangHelper.toggleAllLanguages($event.target.checked);
    }
  }

}
