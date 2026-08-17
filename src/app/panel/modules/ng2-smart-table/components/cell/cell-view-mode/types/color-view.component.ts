import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Cell} from '../../../../lib/data-set/cell';

@Component({
    selector: 'color-view-component',
    template: `<div [style.background]="cell.getValue()"></div>`,
    styles: ['div { height: 25px; }'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ColorViewComponent implements OnInit {

    @Input() cell: Cell;

    ngOnInit() {
    }
}
