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
    }

    onAction(action: any): void {
        event.preventDefault();
        event.stopPropagation();
        this.action.emit({
            action: action,
            data: this.row.getData()
        });
    }
}
