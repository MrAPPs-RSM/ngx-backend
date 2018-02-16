import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormField} from '../../interfaces/form-field';

@Component({
    selector: 'app-date-time-range',
    templateUrl: './date-time-range.component.html',
    styleUrls: ['./date-time-range.component.scss']
})
export class DateTimeRangeComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() field: FormField;

    constructor() {
    }

    ngOnInit() {
    }

    get isStartDateValid() {

    }

    get isEndDateValid() {

    }

    get isValid() {
        // TODO: date range valid and each field valid
    }

}