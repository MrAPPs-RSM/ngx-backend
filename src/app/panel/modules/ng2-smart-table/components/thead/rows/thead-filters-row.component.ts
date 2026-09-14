import {Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy} from '@angular/core';

import {Grid} from '../../../lib/grid';
import {DataSource} from '../../../lib/data-source/data-source';
import {Column} from "../../../lib/data-set/column";

@Component({
    selector: '[ng2-st-thead-filters-row]',
    template: `
        @if (isDragEnabled) {
          <th></th>
        }
        @if (isMultiSelectVisible) {
          <th></th>
        }
        @for (column of grid.getVisibleColumns(); track column) {
          <th class="ng2-smart-th {{ column.id }}">
            <ng2-smart-table-filter [source]="source"
              [grid]="grid"
              [column]="column"
              [filterValue]="getFilterValue(column)"
              [inputClass]="filterInputClass"
              (filter)="filter.emit($event)">
            </ng2-smart-table-filter>
          </th>
        }
        @if (showActionsColumn) {
          <th ng2-st-add-button
            [grid]="grid"
            [source]="source"
            (create)="create.emit()">
          </th>
        }
        `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TheadFitlersRowComponent implements OnChanges {

    @Input() grid: Grid;
    @Input() source: DataSource;
    @Input() isDragEnabled: boolean;
    @Input() activeFilters: any;

    @Output() create = new EventEmitter<any>();
    @Output() filter = new EventEmitter<any>();

    isMultiSelectVisible: boolean;
    filterInputClass: string;
    showActionsColumn: boolean;

    getFilterValue(column: Column) {
        if (this.activeFilters) {
            return column.key ? this.activeFilters[column.key] : this.activeFilters[column.id];
        }

        return null;
    }

    ngOnChanges() {
        this.isMultiSelectVisible = this.grid.isMultiSelectVisible();
        this.filterInputClass = this.grid.getSetting('filter.inputClass');
        const actions = this.grid.getSetting('actions');
        this.showActionsColumn = (actions.hasOwnProperty('add') && actions.add != null) || (actions.hasOwnProperty('list') && actions.list != null && actions.list.length > 0);
    }
}
