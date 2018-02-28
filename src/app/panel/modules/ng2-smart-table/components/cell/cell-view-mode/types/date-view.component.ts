import {Component, Input, OnInit} from '@angular/core';
import {Cell} from '../../../../lib/data-set/cell';
import {UtilsService} from '../../../../../../../services/utils.service';

@Component({
    selector: 'date-view-component',
    template: `{{renderValue}}`,
})
export class DateViewComponent implements OnInit {

    @Input() cell: Cell;

    private renderValue: string;

    ngOnInit() {
        this.renderValue = UtilsService.timeConverter(this.cell.getValue());
    }
}
