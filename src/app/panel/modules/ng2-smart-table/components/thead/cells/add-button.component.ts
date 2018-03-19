import {Component, Input, Output, EventEmitter, AfterViewInit, ElementRef, OnChanges} from '@angular/core';

import {Grid} from '../../../lib/grid';
import {DataSource} from '../../../lib/data-source/data-source';

@Component({
    selector: '[ng2-st-add-button]',
    template: `
        <a *ngIf="isActionAdd" href="#"
           [tooltip]="grid.getSetting('actions.add.name')"
           [tooltipDisabled]="false"
           [tooltipAnimation]="true"
           [tooltipPlacement]="'top'"
           [class]="'ng2-smart-action ng2-smart-action-add-add ' + grid.getSetting('actions.add.class')"
           [innerHTML]="addNewButtonContent" (click)="onAdd($event)"></a>
    `,
})
export class AddButtonComponent implements AfterViewInit, OnChanges {

    @Input() grid: Grid;
    @Input() source: DataSource;
    @Output() create = new EventEmitter<any>();

    isActionAdd: boolean;
    addNewButtonContent: string;

    constructor(private ref: ElementRef) {
    }

    ngAfterViewInit() {
        this.ref.nativeElement.classList.add('ng2-smart-actions-title', 'ng2-smart-actions-title-add');
    }

    ngOnChanges() {
        this.isActionAdd = this.grid.getSetting('actions.add');
        this.addNewButtonContent = this.grid.getSetting('actions.add.content');
    }

    onAdd(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.create.emit();
    }
}
