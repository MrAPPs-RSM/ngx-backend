import {Component, OnInit} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
    selector: 'app-input-text',
    templateUrl: './input-text.component.html',
    styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent extends BaseInputComponent implements OnInit {

    ngOnInit() {
    }

}
