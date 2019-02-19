import {Component, Input, OnInit} from '@angular/core';
import {Cell} from '../../../../lib/data-set/cell';

@Component({
    selector: 'icon-view-component',
    template: `<i [style.color]="color" [class]="'fa ' + icon"></i>`,
    styles: ['i { font-size: 20px; }']
})
export class IconViewComponent implements OnInit {

    @Input() cell: Cell;

    public icon: string;
    public color: string;

    ngOnInit() {

        const value = this.cell.getValue();

         if (typeof value === 'object') {
             this.icon = value.icon || '';
             this.color = value.color || '';
         } else {
             this.icon = value;
             this.color = null;
         }
    }
}
