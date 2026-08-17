import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, ChangeDetectionStrategy} from '@angular/core';

import {DataSource} from '../../lib/data-source/data-source';
import {Column} from '../../lib/data-set/column';
import {Grid} from '../../lib/grid';

@Component({
    selector: 'ng2-smart-table-filter',
    template: `
        @if (column.isFilterable) {
          <div class="ng2-smart-filter">
            @switch (column.getFilterType()) {
              @case ('select') {
                <select-filter
                  [query]="query"
                  [filterValue]="filterValue"
                  [grid]="grid"
                  [reloadOptions]="reloadSelectOptions"
                  [ngClass]="inputClass"
                  [column]="column"
                  (filter)="onFilter($event, column)">
                </select-filter>
              }
              @case ('date') {
                <date-filter
                  [query]="query"
                  [filterValue]="filterValue"
                  [ngClass]="inputClass"
                  [column]="column"
                  (filter)="onFilter($event, column)">
                </date-filter>
              }
              @case ('checkbox') {
                <checkbox-filter
                  [query]="query"
                  [filterValue]="filterValue"
                  [ngClass]="inputClass"
                  [column]="column"
                  (filter)="onFilter($event, column)">
                </checkbox-filter>
              }
              @default {
                <input-filter
                  [query]="query"
                  [filterValue]="filterValue"
                  [ngClass]="inputClass"
                  [column]="column"
                  (filter)="onFilter($event, column)">
              </input-filter>
            }
          }
        </div>
        }
        `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FilterComponent implements OnInit, OnChanges {

    @Input() grid: Grid;
    @Input() column: Column;
    @Input() source: DataSource;
    @Input() filterValue: any;
    @Input() inputClass = '';

    @Output() filter = new EventEmitter<any>();

    query: any;
    reloadSelectOptions: boolean = false;

    ngOnInit() {
        this.setQueryValue();
    }

    setQueryValue() {
        if (this.column.filter) {
            this.query = this.column.filter.multiple ? [] : '';
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.source) {
            if (!changes.source.firstChange) {
                // Just to trigger onChange on select filter
                if (this.column.filter.type === 'select') {
                    this.reloadSelectOptions = !this.reloadSelectOptions;
                }
            }
        }
    }

    onFilter(query: string) {
        this.filter.emit({
            column: this.column.key ? this.column.key : this.column.id,
            value: Array.isArray(query) ? {'inq': query} : query === '' ? null : query
        });
    }
}
