import {Component, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {FormControl} from '@angular/forms';

import {DefaultFilter} from './default-filter';
import 'rxjs/add/operator/debounceTime';

@Component({
    selector: 'checkbox-filter',
    template: `
        <label class="checkbox">
            <input type="checkbox"
                   [formControl]="inputControl"
                   class="form-control"
                   [ngClass]="inputClass">
            <span>
          </span>
        </label>
        <a href="#" *ngIf="filterActive"
           (click)="resetFilter($event)">×</a>
    `,
    styles: [
        'label.checkbox > span { width: 0;}',
        'label.checkbox + a { font-weight: 300; }'
    ]
})
export class CheckboxFilterComponent extends DefaultFilter implements OnInit, OnChanges {

    filterActive: boolean = false;
    inputControl = new FormControl();
    delay = 0;

    constructor() {
        super();
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if (changes['column']) {
           const filter = this.column.getFilter();
           if (typeof filter['default'] !== 'undefined') {
               this.inputControl.setValue(filter['default'], {emitEvent: false});
               this.filterActive = true;
           }
        }
    }

    ngOnInit() {
        this.changesSubscription = (this.inputControl.valueChanges as any)
            .debounceTime(this.delay)
            .subscribe((checked: boolean) => {
                this.filterActive = true;
                this.query = checked;
                this.setFilter();
            });
    }

    resetFilter(event: any) {
        event.preventDefault();
        this.query = '';
        this.inputControl.setValue(false, {emitEvent: false});
        this.filterActive = false;
        this.setFilter();
    }
}
