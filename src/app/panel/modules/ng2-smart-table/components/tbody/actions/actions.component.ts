import {Component, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {Row} from '../../../lib/data-set/row';
import {Grid} from '../../../lib/grid';
import {ConditionalValue} from '../../../../../../interfaces/ConditionalValue';
import {UtilsService} from '../../../../../../services/utils.service';

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
      } else if (Array.isArray(action[key])) {
        const conditions = action[key];
        let result = true;
        for (const condition of conditions) {
          result = result && UtilsService.checkSingleConditionalValue(dataRow[action[key]['property']], condition);
        }
      } else if (typeof action[key] === 'object') {
        return UtilsService.checkSingleConditionalValue(dataRow[action[key]['property']], action[key]);
      }
    }
    return true;
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
