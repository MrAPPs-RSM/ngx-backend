import {debounceTime, distinctUntilChanged, skip} from 'rxjs/operators';
import {Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {FormControl} from '@angular/forms';


import {DefaultFilter} from './default-filter';
import {Subject} from 'rxjs/internal/Subject';

@Component({
    selector: 'input-filter',
    template: `
        <input [(ngModel)]="query"
               [ngClass]="inputClass"
               (ngModelChange)="onModelChange()"
               class="form-control"
               type="text"
               placeholder="{{ column.title }}"/>
    `,
})
export class InputFilterComponent extends DefaultFilter implements OnInit, OnChanges {

    @Input() filterValue: any;

    private searchSubject: Subject<any>;

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
                }
            }
        }
    }

    ngOnInit() {
        this.searchSubject = new Subject();
        this.searchSubject.pipe(debounceTime(this.delay)).subscribe(() => {
            this.setFilter();
        });

        if (this.filterValue) {
            this.query = this.filterValue;
        }
    }

    onModelChange() {
        this.searchSubject.next();
    }
}
