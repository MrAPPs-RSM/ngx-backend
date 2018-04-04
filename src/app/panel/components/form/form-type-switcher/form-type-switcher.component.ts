import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {formConfig} from '../form.config';
import {Language} from '../../../services/language.service';

@Component({
  selector: 'app-form-type-switcher',
  templateUrl: './form-type-switcher.component.html',
  styleUrls: ['./form-type-switcher.component.scss']
})
export class FormTypeSwitcherComponent implements OnInit {

    @Input() index = 0;
    @Input() form: FormGroup;
    @Input() groupName: string;
    @Input() field: any;
    @Input() isEdit: boolean;
    @Input() unique?: Function;
    @Input() currentLang?: Language;
    @Input() isSubField: boolean;

    public formConfig = formConfig;

  constructor() {
  }

  ngOnInit() {
  }

}
