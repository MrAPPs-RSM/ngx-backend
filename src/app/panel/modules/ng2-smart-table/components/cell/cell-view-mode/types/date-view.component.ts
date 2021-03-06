import {Component, Input, OnInit} from '@angular/core';
import {Cell} from '../../../../lib/data-set/cell';
import {UtilsService} from '../../../../../../../services/utils.service';

@Component({
    selector: 'date-view-component',
    template: `{{renderValue}}`,
})
export class DateViewComponent implements OnInit {

    @Input() cell: Cell;

    renderValue: string;

    ngOnInit() {
        if (this.cell.getValue()) {
            this.renderValue = UtilsService.timeConverter(this.cell.getValue(), this.cell.getColumn().dateFormat);
        }
    }
}
