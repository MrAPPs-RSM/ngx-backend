import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
    selector: 'app-separator',
    templateUrl: './separator.component.html',
    styleUrls: ['./separator.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SeparatorComponent extends BaseInputComponent implements OnInit {

    ngOnInit() {
    }

}
