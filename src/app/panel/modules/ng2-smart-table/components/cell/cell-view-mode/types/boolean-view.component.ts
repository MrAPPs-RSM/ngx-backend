import {Component, Input, OnInit} from '@angular/core';
import {Cell} from '../../../../lib/data-set/cell';

@Component({
    selector: 'boolean-view-component',
    template: `<i [class]="renderValue ? 'fa fa-check success' : 'fa fa-times danger'"></i>`,
})
export class BooleanViewComponent implements OnInit {

    @Input() cell: Cell;

    private renderValue: boolean;

    ngOnInit() {
        const value = this.cell.getValue();
        this.renderValue = (value === '1' || value === 1 || value === 'true' || value === true);
    }
}
