import { Component, Input, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormFieldTextarea } from '../../interfaces/form-field-textarea';
import { BaseInputComponent } from '../base-input/base-input.component';
import { LanguageService } from '../../../../services/language.service';

@Component({
    selector: 'app-input-textarea',
    templateUrl: './input-textarea.component.html',
    styleUrls: ['./input-textarea.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class InputTextareaComponent extends BaseInputComponent implements OnInit {

    private static editorStylesPromise: Promise<void>;

    Editor: any = null;

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
    }

    isValid() {
        if (this.getControl().touched) {
            return this.getControl().valid;
        } else {
            return true;
        }
    }

    get readonly() {
      return !!(this.field.disabled || this.onlyView);
    }

    async ngOnInit() {
        if (this.field.options && this.field.options.editor) {
            await this.loadEditorStyles();
            const {
                Alignment, Bold, ClassicEditor, Essentials, Font, GeneralHtmlSupport, Heading, Italic,
                Link, List, Paragraph, Strikethrough, Table, TableToolbar, Underline, Undo
            } = await import('ckeditor5');

            this.Editor = ClassicEditor;

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
                language: this._language.getCurrentLangIsCode(),
                licenseKey: 'GPL',
                plugins: [
                    Essentials, Paragraph, Heading, Bold, Italic, Underline, Strikethrough, Undo,
                    Font, List, Alignment, Table, TableToolbar, Link, GeneralHtmlSupport
                ],
                toolbar: [
                    'undo', 'redo', '|', 'heading', '|', 'fontFamily', 'fontSize',
                    'bold', 'italic', 'underline', 'strikethrough', '|',
                    'bulletedList', 'numberedList', '|', 'alignment', 'insertTable', 'link'
                ],
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                }
            };

            if (this.field.options.allowContent) {
                this.config['htmlSupport'] = {
                    allow: [{name: /.*/, attributes: true, classes: true, styles: true}]
                };
            }
        }
    }

    private loadEditorStyles(): Promise<void> {
        if (!InputTextareaComponent.editorStylesPromise) {
            InputTextareaComponent.editorStylesPromise = new Promise((resolve, reject) => {
                const existing = document.getElementById('ckeditor-styles') as HTMLLinkElement;
                if (existing) {
                    resolve();
                    return;
                }

                const link = document.createElement('link');
                link.id = 'ckeditor-styles';
                link.rel = 'stylesheet';
                link.href = new URL('assets/ckeditor5/ckeditor5.css', document.baseURI).toString();
                link.onload = () => resolve();
                link.onerror = () => reject(new Error('Unable to load CKEditor styles'));
                document.head.appendChild(link);
            });
        }

        return InputTextareaComponent.editorStylesPromise;
    }

    getCountCharacters(key?: string): string {

        const maxLength = this.getMaxLength(key);
        if (!maxLength) {
            return '';
        }

        const length = (this.getControl(key).value || '').length;
        return length + '/' + maxLength;
    }

    onFocus() {
        this.focus = true;
    }
}
