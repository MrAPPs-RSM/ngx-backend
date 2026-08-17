import {Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy} from '@angular/core';

import {DataSource} from '../../../../lib/data-source/data-source';
import {Column} from '../../../../lib/data-set/column';

@Component({
    selector: 'ng2-smart-table-title',
    styleUrls: ['./title.component.scss'],
    template: `
        @if (column.isSortable) {
          <a href="#"
            (click)="_sort($event, column)"
            class="ng2-smart-sort-link sort"
            [ngClass]="currentDirection">
            {{ column.title }}
          </a>
        }
        @if (column.isSortable && currentDirection != '') {
          <span class="ng2-smart-sort remove-sort"
            (click)="_sort($event, null)"
          >×</span>
        }
        @if (!column.isSortable) {
          <span class="ng2-smart-sort">{{ column.title }}</span>
        }
        `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TitleComponent implements OnInit {

    currentDirection = '';
    @Input() column: Column;
    @Input() source: DataSource;
    @Input() activeSort: any[];

    @Output() sort = new EventEmitter<any>();

    ngOnInit() {
        if (this.activeSort && this.activeSort.length > 0) {
            const key = this.column.key ? this.column.key : this.column.id;
            this.activeSort.forEach((item) => {
                if (item.field === key) {
                    this.currentDirection = item.direction.toLowerCase();
                }
            });
        }
    }

    _sort(event: any, column: any) {
        event.preventDefault();

        if (column) {
            this.changeSortDirection();
            this.source.addSort(
                {
                    field: this.column.key ? this.column.key : this.column.id,
                    direction: this.currentDirection,
                    compare: this.column.getCompareFunction(),
                },
            );
        } else {
            this.removeSort();
            this.source.removeSort(this.column.key ? this.column.key : this.column.id);
        }

        this.sort.emit(this.source.getSort());
    }

    changeSortDirection(): string {
        if (this.currentDirection) {
            this.currentDirection = this.currentDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentDirection = this.column.sortDirection;
        }
        return this.currentDirection;
    }

    removeSort(): void {
        this.currentDirection = '';
    }
}
