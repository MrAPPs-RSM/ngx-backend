import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';

import {DataSource} from '../../lib/data-source/data-source';
import {Column} from '../../lib/data-set/column';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'ng2-smart-table-filter',
    template: `
        <div class="ng2-smart-filter" *ngIf="column.isFilterable" [ngSwitch]="column.getFilterType()">
            <select-filter *ngSwitchCase="'select'"
                           [query]="query"
                           [ngClass]="inputClass"
                           [column]="column"
                           (filter)="onFilter($event, column)">
            </select-filter>
            <date-filter *ngSwitchCase="'date'"
                         [query]="query"
                         [ngClass]="inputClass"
                         [column]="column"
                         (filter)="onFilter($event, column)">
            </date-filter>
            <checkbox-filter *ngSwitchCase="'checkbox'"
                             [query]="query"
                             [ngClass]="inputClass"
                             [column]="column"
                             (filter)="onFilter($event, column)">
            </checkbox-filter>
            <input-filter *ngSwitchDefault
                          [query]="query"
                          [ngClass]="inputClass"
                          [column]="column"
                          (filter)="onFilter($event, column)">
            </input-filter>
        </div>
    `,
})
export class FilterComponent implements OnChanges {

    @Input() column: Column;
    @Input() source: DataSource;
    @Input() inputClass: string = '';

    @Output() filter = new EventEmitter<any>();

    query: string = '';

    protected dataChangedSub: Subscription;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.source) {
            if (!changes.source.firstChange) {
                this.dataChangedSub.unsubscribe();
            }
            this.dataChangedSub = this.source.onChanged().subscribe((dataChanges) => {
                const filterConf = this.source.getFilter();
                if (filterConf && filterConf.filters && filterConf.filters.length === 0) {
                    this.query = '';

                    // add a check for existing filters an set the query if one exists for this column
                    // this covers instances where the filter is set by user code while maintaining existing functionality
                } else if (filterConf && filterConf.filters && filterConf.filters.length > 0) {
                    filterConf.filters.forEach((k: any, v: any) => {
                        if (k.field === this.column.id) {
                            this.query = k.search;
                        }
                    });
                }
            });
        }
    }

    onFilter(query: string) {
        this.filter.emit({
            column: this.column.filter.key ? this.column.filter.key : this.column.id,
            value: query
        });
    }
}
