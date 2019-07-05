import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {BaseInputComponent} from '../base-input/base-input.component';
import {FormField} from '../../interfaces/form-field';

@Component({
    selector: 'app-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ImageComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormField;

    url: string;

    constructor() {
        super();
    }

    ngOnInit() {
        this.form.get(this.field.key).valueChanges.subscribe((val) => {
            this.url = val;
        });
    }

    onImageError($event: any): void {
        this.url = environment.assets.imageError;
    }
}
