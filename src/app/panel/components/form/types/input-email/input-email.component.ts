import {Component, Input, OnInit} from '@angular/core';
import {FormField} from '../../interfaces/form-field';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
    selector: 'app-input-email',
    templateUrl: './input-email.component.html',
    styleUrls: ['./input-email.component.scss']
})
export class InputEmailComponent extends BaseInputComponent implements OnInit {
    @Input() field: FormField;

    ngOnInit() {
    }
}
