import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {formConfig} from '../form.config';

@Component({
  selector: 'app-form-type-switcher',
  templateUrl: './form-type-switcher.component.html',
  styleUrls: ['./form-type-switcher.component.scss']
})
export class FormTypeSwitcherComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() field: any;
    public formConfig = formConfig;

  constructor() { }

  ngOnInit() {
  }

}
