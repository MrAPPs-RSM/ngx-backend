import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {formConfig} from '../form.config';
import {Language} from '../../../services/language.service';
import {forEach} from '@angular/router/src/utils/collection';

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
            // TODO: check related fields to enable visibility
            let obj = this.field.visibleOn;

            Object.keys(obj).forEach((key) => {
                let control = this.form.get(key);
                console.log(control);

            });
        }
    }

    ngOnInit() {
    }

}
