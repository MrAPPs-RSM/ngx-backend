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
        step: 1,
        start: 0
    };

    private readonly defaultWith: number = 200;

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
    private isLoading: boolean;

    ngOnInit() {
        this.isVisible = false;

        if (!this.min && !this.max && !this.offset) {
            this.reset();
            this.updateFormValue();
        }

        this.form.controls[this.field.fileKey].valueChanges.subscribe((value) => {
            /** If file is uploaded */
            this.isVisible = value && value.length > 0;
            if (this.isVisible) {
                this.fileId = value[0];
                this.getData();
            }
        });
    }

    getData() {
        this.isLoading = true;
        this._apiService.get(this.field.endpoint + '/' + this.fileId, {offset: this.offset})
            .then((response: PreviewResponse) => {
                this.isLoading = false;
                this.url = response.url;
                this.min = response.min;
                this.max = response.max;
                this.offset = response.offset;
                this.updateFormValue();

                console.log(this.min, this.max, this.offset);
            })
            .catch((response: ErrorResponse) => {
                this.isLoading = false;
                this.reset();
                console.log(response.error);
            });
    }

    onChange(value: any) {
        if (value !== this.offset) {
            this.offset = value;
            this.getData();
        }
    }

    onImageError() {
        this.url = '../../../../../assets/images/image-error.png';
    }

    updateFormValue() {
        this.getControl().setValue(this.offset);
    }

    reset() {
        this.min = 0;
        this.max = 10;
        this.offset = 0;
    }
}

interface PreviewResponse {
    url: string;
    min: number;
    max: number;
    offset: number;
}
