import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormFieldTextarea} from '../../interfaces/form-field-textarea';
import {BaseInputComponent} from '../base-input/base-input.component';


@Component({
    selector: 'app-input-textarea',
    templateUrl: './input-textarea.component.html',
    styleUrls: ['./input-textarea.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InputTextareaComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormFieldTextarea;

    ngOnInit() {
    }
}
