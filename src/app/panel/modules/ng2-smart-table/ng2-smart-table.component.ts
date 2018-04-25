import {Component, Input, Output, SimpleChange, EventEmitter, OnChanges, OnInit, OnDestroy} from '@angular/core';

import {Grid} from './lib/grid';
import {DataSource} from './lib/data-source/data-source';
import {Row} from './lib/data-set/row';
import {deepExtend} from './lib/helpers';
import {LocalDataSource} from './lib/data-source/local/local.data-source';
import {TablePagination} from './lib/data-filters/table-pagination';
import {TableSort} from './lib/data-filters/table-sort';
import {TableFilter} from './lib/data-filters/table-filter';
import {TableActiveFilters} from './lib/data-filters/table-active-filters';
import {DragulaService} from 'ng2-dragula';

@Component({
    selector: 'ng2-smart-table',
    styleUrls: ['./ng2-smart-table.component.scss'],
    templateUrl: './ng2-smart-table.component.html',
})
export class Ng2SmartTableComponent implements OnChanges, OnInit, OnDestroy {

    @Input() count: number;
    @Input() source: any;
    @Input() settings: any = {};
    @Input() activeFilters: TableActiveFilters;
    @Input() isDragEnabled: boolean;

    @Output() rowSelect = new EventEmitter<any>();
    @Output() userRowSelect = new EventEmitter<any>();
    @Output() rowHover: EventEmitter<any> = new EventEmitter<any>();
    @Output() rowDrop: EventEmitter<any> = new EventEmitter();

    @Output() create: EventEmitter<any> = new EventEmitter<any>();
    @Output() action: EventEmitter<any> = new EventEmitter<any>();
    @Output() sort: EventEmitter<any> = new EventEmitter<any>();
    @Output() filter: EventEmitter<any> = new EventEmitter<any>();
    @Output() paginate: EventEmitter<any> = new EventEmitter<any>();

    tableClass: string;
    tableId: string;
    isHideHeader: boolean;
    isHideSubHeader: boolean;
    isPagerDisplay: boolean;
    rowClassFunction: Function;

    // Object to emit
    filters: any = {};

    grid: Grid;
    defaultSettings: Object = {
        mode: 'inline', // inline|external|click-to-edit
        selectMode: 'single', // single|multi
        hideHeader: false,
        hideSubHeader: false,
        columns: {},
        pager: {
            display: true,
            perPage: 5,
        }
    };

    isAllSelected: boolean = false;

    constructor(private _dragulaService: DragulaService) {
    }

    ngOnInit() {
        if (this.isDragEnabled) {
            this._dragulaService.setOptions('bag', {
                moves: function (el, container, handle) {
                    return handle.className === 'drag';
                }
            });
            this._dragulaService.drop.subscribe((value) => {
                this.onDrop();
            });
        }
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if (this.grid) {
            if (changes['settings']) {
                this.grid.setSettings(this.settings);
            }
            if (changes['source']) {
                this.source = this.prepareSource();
                this.grid.setSource(this.source);
            }
        } else {
            this.initGrid();
        }
        this.tableId = this.grid.getSetting('attr.id');
        this.tableClass = this.grid.getSetting('attr.class');
        this.isHideHeader = this.grid.getSetting('hideHeader');
        this.isHideSubHeader = this.grid.getSetting('hideSubHeader');
        this.isPagerDisplay = this.grid.getSetting('pager.display');
        this.rowClassFunction = this.grid.getSetting('rowClassFunction');
    }


    ngOnDestroy() {
        this._dragulaService.destroy('bag');
    }


    onUserSelectRow(row: Row) {
        if (this.grid.getSetting('selectMode') !== 'multi') {
            this.grid.selectRow(row);
            this.emitUserSelectRow(row);
            this.emitSelectRow(row);
        }
    }

    onRowHover(row: Row) {
        this.rowHover.emit(row);
    }

    multipleSelectRow(row: Row) {
        this.grid.multipleSelectRow(row);
        this.emitUserSelectRow(row);
        this.emitSelectRow(row);
    }

    onSelectAllRows($event: any) {
        $event.preventDefault();
        $event.stopPropagation();

        this.isAllSelected = !this.isAllSelected;
        this.grid.selectAllRows(this.isAllSelected);

        this.emitUserSelectRow(null);
        this.emitSelectRow(null);
    }

    initGrid() {
        this.source = this.prepareSource();
        this.grid = new Grid(this.source, this.prepareSettings());
        this.grid.onSelectRow().subscribe((row) => this.emitSelectRow(row));
    }

    prepareSource(): DataSource {
        const source = new LocalDataSource(this.source);
        source.setCount(this.count);
        if (this.activeFilters) {
            source.setSort(this.activeFilters.sort);
            source.setPaging(this.activeFilters.pagination.page, this.activeFilters.pagination.perPage);
        }
        return source;
    }

    prepareSettings(): Object {
        return deepExtend({}, this.defaultSettings, this.settings);
    }

    onPagination($event: TablePagination) {
        this.paginate.emit($event);
        this.resetAllSelector();
    }

    onSort($event: TableSort) {
        this.sort.emit($event);
        this.resetAllSelector();
    }

    onFilter($event: TableFilter) {
        this.filters[$event.column] = $event.value;

        this.filter.emit(this.filters);
        this.resetAllSelector();
    }

    private resetAllSelector() {
        this.isAllSelected = false;
    }

    private emitUserSelectRow(row: Row) {
        const selectedRows = this.grid.getSelectedRows();
        this.userRowSelect.emit({
            selected: selectedRows && selectedRows.length ? selectedRows.map((r: Row) => r.getData()) : [],
        });
    }

    private emitSelectRow(row: Row) {
        this.rowSelect.emit({
            data: row ? row.getData() : null,
            isSelected: row ? row.getIsSelected() : null,
        });
    }

    /** ---------------- DRAG & DROP ------------------ */

    private onDrop() {
        const data = [];
        const rows: any[] = this.grid.getRows();
        setTimeout(() => {
            rows.forEach((item) => {
                data.push(item.data);
            });

            this.rowDrop.emit({
                data: data
            });
        }, 0);
    }
}
