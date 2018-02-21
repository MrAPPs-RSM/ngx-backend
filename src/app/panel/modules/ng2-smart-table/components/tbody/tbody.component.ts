import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';

import {Grid} from '../../lib/grid';
import {DataSource} from '../../lib/data-source/data-source';

@Component({
    selector: '[ng2-st-tbody]',
    styleUrls: ['./tbody.component.scss'],
    templateUrl: './tbody.component.html',
})
export class Ng2SmartTableTbodyComponent implements OnChanges {

    @Input() grid: Grid;
    @Input() source: DataSource;
    @Input() rowClassFunction: Function;

    @Output() action = new EventEmitter<any>();
    @Output() userSelectRow = new EventEmitter<any>();
    @Output() editRowSelect = new EventEmitter<any>();
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
}
