import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {Row} from '../../../lib/data-set/row';
import {Grid} from '../../../lib/grid';

@Component({
    selector: 'ng2-st-tbody-actions',
    templateUrl: './actions.component.html',
})
export class ActionsComponent implements OnChanges {

    @Input() grid: Grid;
    @Input() row: Row;
    @Output() action = new EventEmitter<any>();

    actions: any[] = [];

    constructor() {
    }

    ngOnChanges() {
        this.actions = this.grid.getSetting('actions.list');

        const dataRow = this.row.getData();

        for (const action of this.actions) {
            action['enabled'] = this.getProperty(action, dataRow, 'enableOn');
            action['visible'] = this.getProperty(action, dataRow, 'visibleOn');
        }
    }

    private getProperty(action: any, dataRow: any, key: string): boolean {
        if (key in action) {
            if (typeof action[key] === 'string') {
                if (action[key].indexOf('!') > -1) {
                    return !dataRow[action[key].replace('!', '')];
                } else {
                    return dataRow[action[key]];
                }
            } else if (typeof action[key] === 'object') {
                if ('property' in action[key] && 'value' in action[key]) {
                    if ('operator' in action[key]) {
                        let result: boolean;
                        switch (action[key]['operator']) {
                            case 'neq': {
                                result = dataRow[action[key]['property']] !== action[key]['value'];
                            }
                                break;
                            default: {
                                result = dataRow[action[key]['property']] === action[key]['value'];
                            }
                                break;
                            // TODO: handle like, in, or other properties (?)
                        }
                        return result;
                    } else {
                        return dataRow[action[key]['property']] === action[key]['value'];
                    }
                } else {
                    return true;
                }
            }
        } else {
            return true;
        }
    }

    onAction($event: any, action: any): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.action.emit({
            action: action,
            data: this.row.getData()
        });
    }
}
