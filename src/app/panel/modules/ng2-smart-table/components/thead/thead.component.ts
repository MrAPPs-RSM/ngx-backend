import {Component, Input, Output, EventEmitter, OnChanges, OnInit} from '@angular/core';

import {Grid} from '../../lib/grid';
import {DataSource} from '../../lib/data-source/data-source';

@Component({
    selector: '[ng2-st-thead]',
    templateUrl: './thead.component.html',
})
export class Ng2SmartTableTheadComponent implements OnInit, OnChanges {

    @Input() grid: Grid;
    @Input() source: DataSource;
    @Input() isAllSelected: boolean;
    @Input() isDragEnabled: boolean;

    @Output() sort = new EventEmitter<any>();
    @Output() selectAllRows = new EventEmitter<any>();
    @Output() create = new EventEmitter<any>();
    @Output() filter = new EventEmitter<any>();

    isHideHeader: boolean;
    isHideSubHeader: boolean;

    ngOnInit() {
        console.log('THEAD');
        console.log(this.isDragEnabled);
    }

    ngOnChanges() {
        this.isHideHeader = this.grid.getSetting('hideHeader');
        this.isHideSubHeader = this.grid.getSetting('hideSubHeader');
    }
}
