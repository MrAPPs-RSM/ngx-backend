import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {formConfig} from './form.config';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

    /**
     * This component should ONLY get in input an array and render the HTML structure of the wanted form
     */
    @Input() fields: any[] = [];
    @Input() form: FormGroup;
    @Input() isEdit: boolean;

    formConfig = formConfig;

    constructor() {
    }

    ngOnInit() {
    }
}
