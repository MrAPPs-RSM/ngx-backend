import {Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy} from '@angular/core';

import {Grid} from '../../../lib/grid';
import {DataSource} from '../../../lib/data-source/data-source';
import {Column} from "../../../lib/data-set/column";

@Component({
    selector: '[ng2-st-thead-titles-row]',
    template: `
        @if (isDragEnabled) {
          <th ng2-st-drag-title [ngStyle]="{'width': $safeNavigationMigration(column?.width)}" [ngClass]="{'col-mod': column?.width != null }"></th>
        }
        @if (isMultiSelectVisible) {
          <th ng2-st-checkbox-select-all [ngClass]="{'col-mod': column?.width != null }"
            [grid]="grid"
            [source]="source"
            [isAllSelected]="isAllSelected"
            (click)="selectAllRows.emit($event)" [ngStyle]="{'width': $safeNavigationMigration(column?.width)}">
          </th>
        }
        @for (column of grid.getVisibleColumns(); track column) {
          <th class="ng2-smart-th {{ column.id }}" [ngStyle]="{'width': $safeNavigationMigration(column?.width)}"
            [ngClass]="setClasses(column)">
            <ng2-st-column-title
              [activeSort]="getActiveSort(column)"
              [source]="source"
              [column]="column"
              (sort)="sort.emit($event)"
              >
            </ng2-st-column-title>
          </th>
        }
        @if (showActionsColumn) {
          <th ng2-st-actions-title [grid]="grid" [ngStyle]="{'width': $safeNavigationMigration(column?.width)}" [ngClass]="{'col-mod': column?.width != null }"></th>
        }
        `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
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

    setClasses(column: Column) {
      return (column?.class ?? '') + ' ' + (column?.width ? 'col-mod' : '')
    }
}
