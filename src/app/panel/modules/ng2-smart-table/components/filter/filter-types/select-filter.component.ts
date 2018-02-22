import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';

import {DefaultFilter} from './default-filter';

@Component({
    selector: 'select-filter',
    template: `
        <div [formGroup]="formGroup">
            <ng-select [items]="column.getFilterConfig().list"
                       [multiple]="false"
                       [formControl]="inputControl"
                       [(ngModel)]="query"
                       bindLabel="title"
                       bindValue="value"
                       [placeholder]="column.getFilterConfig().selectText"
            >
            </ng-select>
        </div>
    `
})
export class SelectFilterComponent extends DefaultFilter implements OnInit {

    formGroup: FormGroup;
    inputControl = new FormControl();

    constructor() {
        super();
        this.formGroup = new FormGroup({
            select: this.inputControl
        });
    }

    ngOnInit() {
        (this.inputControl.valueChanges as any)
            .skip(1)
            .distinctUntilChanged()
            .debounceTime(this.delay)
            .subscribe((value: string) => this.setFilter());
    }
}
