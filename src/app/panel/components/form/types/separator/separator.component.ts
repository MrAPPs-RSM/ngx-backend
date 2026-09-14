import {Component, Input, OnInit, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {Separator} from '../../interfaces/separator';

@Component({
    selector: 'app-separator',
    templateUrl: './separator.component.html',
    styleUrls: ['./separator.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SeparatorComponent implements OnInit {

    @Input() field: Separator;

    ngOnInit() {
    }

}
