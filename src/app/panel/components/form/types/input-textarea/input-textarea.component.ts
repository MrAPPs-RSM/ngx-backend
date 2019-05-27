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

    private options: any[] = [
        ['Format', 'Font', 'FontSize', 'Bold', 'Italic', 'Underline', 'StrikeThrough', '-', 'Undo', 'Redo', '-', 'Cut', 'Copy', 'Paste', '-', 'Outdent', 'Indent'],
        ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        '/',
        ['Table', '-', 'Link', 'Smiley', 'TextColor', 'BGColor', 'Source']
    ];
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

            if (this.field.options.disable && this.field.options.disable.length > 0) {
                this.field.options.disable.forEach((option) => {
                    let index = this.options[0].indexOf(option);
                    if (index > -1) {
                        this.options[0].splice(index, 1);
                    }
                    index = this.options[1].indexOf(option);
                    if (index > -1) {
                        this.options[1].splice(index, 1);
                    }
                    index = this.options[3].indexOf(option);
                    if (index > -1) {
                        this.options[3].splice(index, 1);
                    }
                });
            }

            this.config = {
                language: this._language.getCurrentLang().isoCode,
                toolbar: this.options
            };

            if (this.field.options.allowContent) {
                this.config['allowedContent'] = true;
                this.config['extraAllowedContent'] = '*(*);*{*}';
            }
        }
    }

    getCountCharacters(key?: string): string {

        const maxLength = this.getMaxLength(key);
        if (!maxLength) return '';

        const length = (this.getControl(key).value || '').length;
        return length + '/' + maxLength;
    }

    onFocus() {
        this.focus = true;
    }
}
