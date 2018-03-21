import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {ApiService, ErrorResponse} from '../../../../../api/api.service';
import {FormFieldPreview} from '../../interfaces/form-field-preview';

@Component({
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PreviewComponent extends BaseInputComponent implements OnInit {

    /** Fixed slider configuration */
    private readonly sliderConfig: any = {
        connect: [true, false],
        behaviour: 'tap',
        tooltips: false,
        step: 1
    };

    @Input() field: FormFieldPreview;

    constructor(private _apiService: ApiService) {
        super();
    }

    private isVisible: boolean;

    private min: number;
    private max: number;
    private offset: number;

    private fileId: number;
    private url: string;

    ngOnInit() {
        this.reset();
        this.updateFormValue();

        this.isVisible = false;

        if (this.isEdit) {
            this.getControl().valueChanges.first().subscribe((value) => {
                this.offset = value;
                this.onFileChange();
            });
        }

        this.onFileChange();
    }

    onFileChange() {
        this.form.controls[this.field.fileKey].valueChanges.subscribe((value) => {
            /** If file is uploaded */
            if (value) {
                if (value instanceof Array) {
                    this.isVisible = value && value.length > 0;
                    if (this.isVisible) {
                        this.fileId = value[0];
                    }
                } else {
                    this.isVisible = !!value;
                    this.fileId = value.id;
                }
                this.getData();
            } else {
                this.offset = 0;
                this.isVisible = false;
            }
        });
    }

    getData() {
        if (this.fileId) {
            this._apiService.get(this.field.endpoint + '/' + this.fileId, {offset: this.offset})
                .then((response: PreviewResponse) => {
                    this.url = response.url;
                    this.min = response.min;
                    this.max = response.max;
                    this.offset = response.offset;
                    this.updateFormValue();
                })
                .catch((response: ErrorResponse) => {
                    this.reset();
                });
        }
    }

    onChange() {
        this.getData();
    }

    onImageError() {
        this.url = '../../../../../assets/images/image-error.png';
    }

    updateFormValue() {
        this.getControl().setValue(this.offset);
    }

    reset() {
        this.min = 0;
        this.max = 0;
        this.offset = 0;
    }
}

interface PreviewResponse {
    url: string;
    min: number;
    max: number;
    offset: number;
}
