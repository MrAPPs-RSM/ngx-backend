import {Component, Input, OnInit} from '@angular/core';
import {Cell} from '../../../../lib/data-set/cell';

@Component({
    selector: 'icon-view-component',
    template: `<i [class]="'fa ' + cell.getValue()"></i>`,
    styles: ['i { font-size: 20px; }']
})
export class IconViewComponent implements OnInit {

    @Input() cell: Cell;

    ngOnInit() {}
}
