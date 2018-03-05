import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {formConfig} from '../form.config';

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

    public formConfig = formConfig;

  constructor() {
  }

  ngOnInit() {
  }

}
