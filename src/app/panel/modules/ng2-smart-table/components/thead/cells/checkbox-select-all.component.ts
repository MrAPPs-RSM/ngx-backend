import {Component, Input} from '@angular/core';

import {Grid} from '../../../lib/grid';
import {DataSource} from '../../../lib/data-source/data-source';

@Component({
    selector: '[ng2-st-checkbox-select-all]',
    template: `
        <label class="checkbox">
            <input type="checkbox"
                   [ngModel]="isAllSelected"
                   class="form-control">
            <span></span>
        </label>
    `,
})
export class CheckboxSelectAllComponent {

    @Input() grid: Grid;
    @Input() source: DataSource;
    @Input() isAllSelected: boolean;
}
