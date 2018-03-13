import {Component, Input, OnInit} from '@angular/core';
import {Cell} from '../../../../lib/data-set/cell';

@Component({
    selector: 'url-view-component',
    template: `<a [href]="renderValue" target="_blank">{{ cell.getValue() }}</a>`,
})
export class UrlViewComponent implements OnInit {

    @Input() cell: Cell;

    renderValue: string;

    ngOnInit() {
        const value = this.cell.getValue();
        if (value.indexOf('https') === -1 || value.indexOf('http') === -1) {
            this.renderValue = '//' + value;
        } else {
            this.renderValue = value;
        }
    }
}
