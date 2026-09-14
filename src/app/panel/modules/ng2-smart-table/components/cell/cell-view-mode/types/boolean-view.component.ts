import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Cell} from '../../../../lib/data-set/cell';

@Component({
    selector: 'boolean-view-component',
    template: `<i [class]="renderValue ? 'fa fa-check success' : 'fa fa-times danger'"></i>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BooleanViewComponent implements OnInit {

    @Input() cell: Cell;

    renderValue: boolean;

    ngOnInit() {
        const value = this.cell.getValue();
        this.renderValue = (value === '1' || value === 1 || value === 'true' || value === true);
    }
}
