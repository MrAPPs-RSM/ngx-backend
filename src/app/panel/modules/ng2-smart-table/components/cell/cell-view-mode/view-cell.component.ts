import {Component, Input, ChangeDetectionStrategy} from '@angular/core';

import {Cell} from '../../../lib/data-set/cell';

@Component({
    selector: 'table-cell-view-mode',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div [ngSwitch]="cell.getColumn().type">
            <date-view-component *ngSwitchCase="'date'" [cell]="cell"></date-view-component>
            <color-view-component *ngSwitchCase="'color'" [cell]="cell"></color-view-component>
            <image-view-component *ngSwitchCase="'image'" [cell]="cell"></image-view-component>
            <url-view-component *ngSwitchCase="'url'" [cell]="cell"></url-view-component>
            <email-view-component *ngSwitchCase="'email'" [cell]="cell"></email-view-component>
            <boolean-view-component *ngSwitchCase="'boolean'" [cell]="cell"></boolean-view-component>
            <custom-view-component *ngSwitchCase="'custom'" [cell]="cell"></custom-view-component>
            <div *ngSwitchCase="'html'" [innerHTML]="cell.getValue()"></div>
            <div *ngSwitchDefault>{{ cell.getValue() }}</div>
        </div>
    `,
})
export class ViewCellComponent {

    @Input() cell: Cell;
}
