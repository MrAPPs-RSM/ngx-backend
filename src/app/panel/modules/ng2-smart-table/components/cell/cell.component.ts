import {Component, Input, Output, EventEmitter} from '@angular/core';

import {Grid} from '../../lib/grid';
import {Cell} from '../../lib/data-set/cell';
import {Row} from '../../lib/data-set/row';

@Component({
    selector: 'ng2-smart-table-cell',
    template: `
        <table-cell-view-mode [cell]="cell"></table-cell-view-mode>
    `,
})
export class CellComponent {

    @Input() grid: Grid;
    @Input() row: Row;
    @Input() isNew: boolean;
    @Input() cell: Cell;
    @Input() inputClass: string = '';
    @Input() mode: string = 'inline';
}
