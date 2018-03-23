import {Component, OnInit} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent extends BaseInputComponent implements OnInit {


    ngOnInit() {
    }

}
