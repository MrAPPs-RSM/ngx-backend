import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

import {getDeepFromObject} from './helpers';
import {Column} from './data-set/column';
import {Row} from './data-set/row';
import {DataSet} from './data-set/data-set';
import {DataSource} from './data-source/data-source';

export class Grid {

    source: DataSource;
    settings: any;
    dataSet: DataSet;

    onSelectRowSource = new Subject<any>();

    constructor(source: DataSource, settings: any) {
        this.setSettings(settings);
        this.setSource(source);
    }

    isMultiSelectVisible(): boolean {
        return this.getSetting('selectMode') === 'multi';
    }

    setSettings(settings: Object) {
        this.settings = settings;
        this.dataSet = new DataSet([], this.getSetting('columns'));

        if (this.source) {
            this.source.refresh();
        }
    }

    setSource(source: DataSource) {
        if (this.source) {
            this.source = source;
        } else {
            this.source = this.prepareSource(source);
        }

        this.source.onChanged().subscribe((changes) => this.processDataChange(changes));

        this.source.onUpdated().subscribe((data) => {
            const changedRow = this.dataSet.findRowByData(data);
            changedRow.setData(data);
        });
    }

    getSetting(name: string, defaultValue?: any): any {
        return getDeepFromObject(this.settings, name, defaultValue);
    }

    getColumns(): Array<Column> {
        return this.dataSet.getColumns();
    }

    getVisibleColumns(): Array<Column> {
        return this.dataSet.getVisibleColumns();
    }

    getRows(): Array<Row> {
        return this.dataSet.getRows();
    }

    selectRow(row: Row) {
        this.dataSet.selectRow(row);
    }

    multipleSelectRow(row: Row) {
        this.dataSet.multipleSelectRow(row);
    }

    onSelectRow(): Observable<any> {
        return this.onSelectRowSource.asObservable();
    }

    processDataChange(changes: any) {
        if (this.shouldProcessChange(changes)) {
            this.dataSet.setData(changes['elements']);
        }
    }

    shouldProcessChange(changes: any): boolean {
        if (['filter', 'sort', 'page', 'remove', 'refresh', 'load', 'paging'].indexOf(changes['action']) !== -1) {
            return true;
        } else if (!this.getSetting('pager.display')) {
            return true;
        }

        return false;
    }

    prepareSource(source: any): DataSource {
        const initialSource: any = this.getInitialSort();
        if (initialSource && initialSource['field'] && initialSource['direction']) {
            source.setSort([initialSource], false);
        }
        if (this.getSetting('pager.display') === true) {
            source.setPaging(1, this.getSetting('pager.perPage'), false);
        }

        source.refresh();
        return source;
    }

    getInitialSort() {
        const sortConf: any = {};
        this.getColumns().forEach((column: Column) => {
            if (column.isSortable && column.defaultSortDirection) {
                sortConf['field'] = column.id;
                sortConf['direction'] = column.defaultSortDirection;
                sortConf['compare'] = column.getCompareFunction();
            }
        });
        return sortConf;
    }

    getSelectedRows(): Array<any> {
        return this.dataSet.getRows()
            .filter(r => r.isSelected);
    }

    selectAllRows(status: any) {
        this.dataSet.getRows()
            .forEach(r => r.isSelected = status);
    }
}
