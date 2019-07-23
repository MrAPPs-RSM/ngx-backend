import { Component, Input, OnInit } from '@angular/core';
import { Cell } from '../../../../lib/data-set/cell';

@Component({
    selector: 'message-view-component',
    template: `{{renderValue}}`,
})
export class MessageviewComponent implements OnInit {

    @Input() cell: Cell;

    renderValue: string = '';

    ngOnInit() {
        const value = this.cell.getValue();
        if (value) {
            const maxLenght = 40;
            if (value.length > maxLenght) {
                this.renderValue = this.cell.getValue().substring(0, maxLenght) + '...';
            } else {
                this.renderValue = this.cell.getValue();
            }
        }
    }
}
