import {Component, OnInit} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
    selector: 'app-plain',
    templateUrl: './plain.component.html',
    styleUrls: ['./plain.component.scss']
})
export class PlainComponent extends BaseInputComponent implements OnInit {

    ngOnInit() {
    }

}
