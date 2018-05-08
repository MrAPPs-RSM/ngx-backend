import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';

import {Grid} from '../../../lib/grid';
import {DataSource} from '../../../lib/data-source/data-source';
import {Column} from "../../../lib/data-set/column";

@Component({
    selector: '[ng2-st-thead-titles-row]',
    template: `
        <th ng2-st-drag-title *ngIf="isDragEnabled"></th>
        <th ng2-st-checkbox-select-all *ngIf="isMultiSelectVisible"
            [grid]="grid"
            [source]="source"
            [isAllSelected]="isAllSelected"
            (click)="selectAllRows.emit($event)">
        </th>
        <th *ngFor="let column of grid.getVisibleColumns()" class="ng2-smart-th {{ column.id }}"
            [ngClass]="column.class">
            <ng2-st-column-title
                    [activeSort]="getActiveSort(column)"
                    [source]="source"
                    [column]="column"
                    (sort)="sort.emit($event)"
                    [ngStyle]="{'width':column.width,'display':'inline-block'}">
            </ng2-st-column-title>
        </th>
        <th ng2-st-actions-title *ngIf="showActionsColumn" [grid]="grid"></th>
    `,
})
export class TheadTitlesRowComponent implements OnChanges {

    @Input() grid: Grid;
    @Input() isAllSelected: boolean;
    @Input() isDragEnabled: boolean;
    @Input() source: DataSource;
    @Input() activeSort: any;

    @Output() sort = new EventEmitter<any>();
    @Output() selectAllRows = new EventEmitter<any>();

    isMultiSelectVisible: boolean;

    showActionsColumn: boolean;

    ngOnChanges() {
        this.isMultiSelectVisible = this.grid.isMultiSelectVisible();
        const actions = this.grid.getSetting('actions');
        this.showActionsColumn = (actions.hasOwnProperty('add') && actions.add != null) || (actions.hasOwnProperty('list') && actions.list != null && actions.list.length > 0);
    }

    getActiveSort(column: Column) {
        const output = [];
        if (this.activeSort && this.activeSort.length > 0) {
            const key = column.key ? column.key : column.id;
            this.activeSort.forEach((item) => {
                if (item.field === key) {
                    output.push(item);
                }
            });
        }

        return output;
    }
}
