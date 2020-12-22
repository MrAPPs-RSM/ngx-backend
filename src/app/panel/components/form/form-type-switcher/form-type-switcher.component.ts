import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
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
    @Input() putFilesOnLanguages?: boolean;
    @Input() field: any;
    @Input() isEdit: boolean;
    @Input() onlyView: boolean;
    @Input() unique?: Function;
    @Input() currentLang?: Language;
    @Input() isSubField: boolean;

    public formConfig = formConfig;

    constructor() {
    }

    isVisible(): boolean {
        if (!this.field.visibleOn) {
            return true;
        } else {
            let response = true;
            Object.keys(this.field.visibleOn).forEach((key) => {
                let control: AbstractControl;
                if (key.indexOf('.') > -1) {
                    control = this.form.get(key.split('.')[1]);
                } else {
                    control = 'parent' in this.form && this.form.parent ? this.form.parent.get(key) : this.form.get(key);
                }
                if (control.value === this.field.visibleOn[key]) {
                    response = response && true;
                } else {
                    response = response && false;
                }
            });
            return response;
        }
    }

    ngOnInit() {
    }

}
