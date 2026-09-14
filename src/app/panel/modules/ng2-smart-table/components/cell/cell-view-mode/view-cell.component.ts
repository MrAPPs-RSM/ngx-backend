import {Component, Input, ChangeDetectionStrategy} from '@angular/core';

import {Cell} from '../../../lib/data-set/cell';

@Component({
    selector: 'table-cell-view-mode',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div>
          @switch (cell.getColumn().type) {
            @case ('icon') {
              <icon-view-component [cell]="cell"></icon-view-component>
            }
            @case ('date') {
              <date-view-component [cell]="cell"></date-view-component>
            }
            @case ('color') {
              <color-view-component [cell]="cell"></color-view-component>
            }
            @case ('image') {
              <image-view-component [cell]="cell"></image-view-component>
            }
            @case ('url') {
              <url-view-component [cell]="cell"></url-view-component>
            }
            @case ('email') {
              <email-view-component [cell]="cell"></email-view-component>
            }
            @case ('boolean') {
              <boolean-view-component [cell]="cell"></boolean-view-component>
            }
            @case ('custom') {
              <custom-view-component [cell]="cell"></custom-view-component>
            }
            @case ('message') {
              <message-view-component [cell]="cell"></message-view-component>
            }
            @case ('html') {
              <div [innerHTML]="cell.getValue()"></div>
            }
            @default {
              <div>{{ getTextValue() }}</div>
            }
          }
        </div>
        `,
    standalone: false
})
export class ViewCellComponent {

    @Input() cell: Cell;

    getTextValue(): any {
        const value = this.cell.getValue();

        if (typeof value !== 'string' || !value.includes('<')) {
            return value;
        }

        return new DOMParser()
            .parseFromString(value, 'text/html')
            .body.textContent || '';
    }
}
