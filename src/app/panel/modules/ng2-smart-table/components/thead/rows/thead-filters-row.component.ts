import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';

import {Grid} from '../../../lib/grid';
import {DataSource} from '../../../lib/data-source/data-source';

@Component({
    selector: '[ng2-st-thead-filters-row]',
    template: `
        <th *ngIf="isMultiSelectVisible"></th>
        <th *ngFor="let column of grid.getVisibleColumns()" class="ng2-smart-th {{ column.id }}">
            <ng2-smart-table-filter [source]="source"
                                    [grid]="grid"
                                    [column]="column"
                                    [inputClass]="filterInputClass"
                                    (filter)="filter.emit($event)">
            </ng2-smart-table-filter>
        </th>
        <th ng2-st-add-button
            [grid]="grid"
            [source]="source"
            (create)="create.emit()">
        </th>
    `,
})
export class TheadFitlersRowComponent implements OnChanges {

    @Input() grid: Grid;
    @Input() source: DataSource;

    @Output() create = new EventEmitter<any>();
    @Output() filter = new EventEmitter<any>();

    isMultiSelectVisible: boolean;
    filterInputClass: string;

    ngOnChanges() {
        this.isMultiSelectVisible = this.grid.isMultiSelectVisible();
        this.filterInputClass = this.grid.getSetting('filter.inputClass');
    }
}
