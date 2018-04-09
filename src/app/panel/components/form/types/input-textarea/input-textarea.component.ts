import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormFieldTextarea} from '../../interfaces/form-field-textarea';
import {BaseInputComponent} from '../base-input/base-input.component';
import {LanguageService} from '../../../../services/language.service';


@Component({
    selector: 'app-input-textarea',
    templateUrl: './input-textarea.component.html',
    styleUrls: ['./input-textarea.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InputTextareaComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormFieldTextarea;
    private focus: boolean;
    config: any = {};

    constructor(private _language: LanguageService) {
        super();
        this.focus = false;
    }

    isValid() {
        if (this.getControl().touched && this.focus) {
            return this.getControl().valid;
        } else {
            return true;
        }
    }

    ngOnInit() {
        if (this.field.options && this.field.options.editor) {
            this.config = {
                language: this._language.getCurrentLang().isoCode,
                toolbar: [
                    ['Format', 'Font', 'FontSize', 'Bold', 'Italic', 'Underline', 'StrikeThrough', '-',
                        'Undo', 'Redo', '-', 'Cut', 'Copy', 'Paste', '-', 'Outdent', 'Indent'],
                    ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
                    '/',
                    ['Table', '-', 'Link', 'Smiley', 'TextColor', 'BGColor', 'Source']
                ]
            };
        }
    }

    onFocus() {
        this.focus = true;
    }
}
