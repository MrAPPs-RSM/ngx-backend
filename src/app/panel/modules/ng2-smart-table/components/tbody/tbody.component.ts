import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';

import {Grid} from '../../lib/grid';
import {DataSource} from '../../lib/data-source/data-source';
import {Row} from "../../lib/data-set/row";

@Component({
    selector: '[ng2-st-tbody]',
    styleUrls: ['./tbody.component.scss'],
    templateUrl: './tbody.component.html',
})
export class Ng2SmartTableTbodyComponent implements OnChanges {

    @Input() grid: Grid;
    @Input() source: DataSource;
    @Input() dragula: any;

    @Output() action = new EventEmitter<any>();
    @Output() userSelectRow = new EventEmitter<any>();
    @Output() multipleSelectRow = new EventEmitter<any>();
    @Output() rowHover = new EventEmitter<any>();

    isMultiSelectVisible: boolean;
    mode: string;
    isActionAdd: boolean;
    noDataMessage: boolean;

    ngOnChanges() {
        this.isMultiSelectVisible = this.grid.isMultiSelectVisible();
        this.mode = this.grid.getSetting('mode');
        this.isActionAdd = this.grid.getSetting('actions.add');
        this.noDataMessage = this.grid.getSetting('noDataMessage');
    }

    onMultipleSelectRow($event: any, row: Row): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.multipleSelectRow.emit(row);
    }

    getColspan(): number {
        let result: number = this.grid.getVisibleColumns().length;
        result += this.isActionAdd ? 1 : 0;
        result += this.isMultiSelectVisible ? 1 : 0;
        return result;
    }
}
