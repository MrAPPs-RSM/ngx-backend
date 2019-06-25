import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormFieldTextarea } from '../../interfaces/form-field-textarea';
import { BaseInputComponent } from '../base-input/base-input.component';
import { LanguageService } from '../../../../services/language.service';

@Component({
    selector: 'app-input-textarea',
    templateUrl: './input-textarea.component.html',
    styleUrls: ['./input-textarea.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InputTextareaComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormFieldTextarea;

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
        }
    }

    getCountCharacters(key?: string): string {

        const maxLength = this.getMaxLength(key);
        if (!maxLength) {
            return '';
        }

        const length = (this.getControl(key).value || '').length;
        return length + '/' + maxLength;
    }
}
