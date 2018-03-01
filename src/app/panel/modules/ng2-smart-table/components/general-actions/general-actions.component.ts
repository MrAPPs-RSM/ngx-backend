import {
    Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit
} from '@angular/core';

import {DataSource} from '../../lib/data-source/data-source';
import {Grid} from '../../lib/grid';
import {TableAction} from '../../../../components/table/interfaces/table-action';

@Component({
    selector: 'ng2-smart-table-general-actions',
    styleUrls: ['./general-actions.component.scss'],
    templateUrl: './general-actions.html',
    encapsulation: ViewEncapsulation.None
})
export class GeneralActionsComponent implements OnInit {

    @Input() grid: Grid;
    @Input() source: DataSource;

    @Output() action = new EventEmitter<any>();

    private actions: TableAction[] = [];

    ngOnInit() {
        this.actions = this.grid.getSetting('generalActions');
    }

    onAction($event: any, action: TableAction): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.action.emit({action: action});
    }
}
