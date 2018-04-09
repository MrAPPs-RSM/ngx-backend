import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';

import {Grid} from '../../../lib/grid';
import {DataSource} from '../../../lib/data-source/data-source';

@Component({
    selector: '[ng2-st-thead-titles-row]',
    template: `
        <th ng2-st-checkbox-select-all *ngIf="isMultiSelectVisible"
            [grid]="grid"
            [source]="source"
            [isAllSelected]="isAllSelected"
            (click)="selectAllRows.emit($event)">
        </th>
        <th *ngFor="let column of grid.getVisibleColumns()" class="ng2-smart-th {{ column.id }}" [ngClass]="column.class"
            [style.width]="column.width">
            <ng2-st-column-title [source]="source" [column]="column" (sort)="sort.emit($event)"></ng2-st-column-title>
        </th>
        <th ng2-st-actions-title [grid]="grid"></th>
    `,
})
export class TheadTitlesRowComponent implements OnChanges {

    @Input() grid: Grid;
    @Input() isAllSelected: boolean;
    @Input() source: DataSource;

    @Output() sort = new EventEmitter<any>();
    @Output() selectAllRows = new EventEmitter<any>();

    isMultiSelectVisible: boolean;


    ngOnChanges() {
        this.isMultiSelectVisible = this.grid.isMultiSelectVisible();
    }

}
