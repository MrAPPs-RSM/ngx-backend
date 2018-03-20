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
        this.isVisible = false;
        this.min = 0;
        this.max = 10;
        this.offset = 0;

        this.form.controls[this.field.fileKey].valueChanges.subscribe((value) => {
            /** If file is uploaded */
            this.isVisible = value && value.length > 0;
            this.fileId = value[0];

            if (this.isVisible) {
                this.getData();
            }
        });
    }

    getData() {
        console.log('calling endpoint');
        this._apiService.get(this.field.endpoint + '/' + this.fileId, {offset: this.offset})
            .then((response: PreviewResponse) => {
                this.url = response.url;
                this.min = response.min;
                this.max = response.max;
                this.offset = response.offset;
            })
            .catch((response: ErrorResponse) => {
                console.log(response.error);
            });
    }

    onChange(value: any) {
        this.offset = value;
        this.getData();
    }
}

interface PreviewResponse {
    url: string;
    min: number;
    max: number;
    offset: number;
}
