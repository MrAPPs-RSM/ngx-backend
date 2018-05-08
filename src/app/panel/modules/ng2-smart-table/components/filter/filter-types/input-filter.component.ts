import {Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {FormControl} from '@angular/forms';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';

import {DefaultFilter} from './default-filter';

@Component({
    selector: 'input-filter',
    template: `
        <input [(ngModel)]="query"
               [ngClass]="inputClass"
               [formControl]="inputControl"
               class="form-control"
               type="text"
               placeholder="{{ column.title }}"/>
    `,
})
export class InputFilterComponent extends DefaultFilter implements OnInit, OnChanges {

    @Input() filterValue: any;

    inputControl = new FormControl();

    constructor() {
        super();
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if (changes['column'] && changes['column'].isFirstChange()) {
            const filter = this.column.getFilter();
            if (filter && typeof filter['default'] !== 'undefined') {
                let value;
                if (typeof filter['default'] === 'object') {
                    if ('like' in filter['default']) {
                        value = filter['default']['like'].replace(/%/g, '');
                    }
                } else if (typeof filter['default'] === 'string') {
                    value = filter['default'];
                }

                if (typeof value !== 'undefined') {
                    this.query = value;
                    this.inputControl.setValue(value, {emitEvent: false});
                }
            }
        }
    }

    ngOnInit() {
        this.inputControl.valueChanges
            .skip(1)
            .distinctUntilChanged()
            .debounceTime(this.delay)
            .subscribe((value: string) => this.setFilter());

        if (this.filterValue) {
            this.query = this.filterValue;
            this.inputControl.setValue(this.filterValue, {emitEvent: false});
        }
    }
}
