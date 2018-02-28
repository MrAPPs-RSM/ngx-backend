import {Component, Input, OnInit} from '@angular/core';
import {FormField} from '../../interfaces/form-field';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
    selector: 'app-input-url',
    templateUrl: './input-url.component.html',
    styleUrls: ['./input-url.component.scss']
})
export class InputUrlComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormField;

    ngOnInit() {
    }
}
