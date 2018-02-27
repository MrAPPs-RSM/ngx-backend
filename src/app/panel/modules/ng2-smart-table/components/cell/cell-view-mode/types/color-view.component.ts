import {Component, Input, OnInit} from '@angular/core';
import {Cell} from '../../../../lib/data-set/cell';

@Component({
    selector: 'color-view-component',
    template: `<div [style.background]="cell.getValue()"></div>`,
    styles: ['div { height: 25px; }']
})
export class ColorViewComponent implements OnInit {

    @Input() cell: Cell;

    ngOnInit() {
    }
}
