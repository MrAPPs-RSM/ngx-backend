import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Separator} from '../../interfaces/separator';

@Component({
    selector: 'app-separator',
    templateUrl: './separator.component.html',
    styleUrls: ['./separator.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SeparatorComponent implements OnInit {

    @Input() field: Separator;

    ngOnInit() {
    }

}
