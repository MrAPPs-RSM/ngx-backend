import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { Grid } from '../../lib/grid';
import { DataSource } from '../../lib/data-source/data-source';
import { Row } from '../../lib/data-set/row';
import { isArray } from 'util';

@Component({
    selector: '[ng2-st-tbody]',
    styleUrls: ['./tbody.component.scss'],
    templateUrl: './tbody.component.html',
})
export class Ng2SmartTableTbodyComponent implements OnChanges {

    @Input() grid: Grid;
    @Input() source: DataSource;
    @Input() isDragEnabled: boolean;

    @Output() action = new EventEmitter<any>();
    @Output() multipleSelectRow = new EventEmitter<any>();

    isMultiSelectVisible: boolean;
    mode: string;
    isActionAdd: boolean;
    noDataMessage: boolean;
    showActionsColumn: boolean;
    rowBgColorSettings: any;


    ngOnChanges() {
        this.isMultiSelectVisible = this.grid.isMultiSelectVisible();
        this.mode = this.grid.getSetting('mode');

        const actions = this.grid.getSetting('actions');
        this.showActionsColumn = (actions.hasOwnProperty('add') && actions.add != null) || (actions.hasOwnProperty('list') && actions.list != null && actions.list.length > 0);

        this.isActionAdd = this.grid.getSetting('actions.add');
        this.noDataMessage = this.grid.getSetting('noDataMessage');
        this.rowBgColorSettings = this.grid.getSetting('rowBgColors', null);
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
        result += this.isDragEnabled ? 1 : 0;
        return result;
    }

    getRowBgColor(row: Row): string {
        let bgColor = '';
        if (this.rowBgColorSettings && isArray(this.rowBgColorSettings)) {
            this.rowBgColorSettings.forEach((setting) => {

                let i = 0;
                while (i < setting.conditions.length) {
                    const fieldVal = row.getData()[setting.conditions[i].field];
                    if (fieldVal !== setting.conditions[i].value) {
                        break;
                    } else {
                        i++;
                    }
                }

                if (i === (setting.conditions.length)) {
                    bgColor = setting.color;
                }

            });
        }

        return bgColor;
    }
}
