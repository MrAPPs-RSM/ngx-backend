import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Cell} from '../../../../lib/data-set/cell';

@Component({
    selector: 'email-view-component',
    template: `<a [href]="'mailto:' + cell.getValue()">{{ cell.getValue() }}</a>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmailViewComponent implements OnInit {

    @Input() cell: Cell;

    ngOnInit() {
    }
}
