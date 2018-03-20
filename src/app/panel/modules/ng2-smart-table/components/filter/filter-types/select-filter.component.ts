import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';

import {DefaultFilter} from './default-filter';
import {ApiService, ErrorResponse} from '../../../../../../api/api.service';

@Component({
    selector: 'select-filter',
    template: `
        <div [formGroup]="formGroup">
            <ng-select [items]="options"
                       [multiple]="false"
                       [formControl]="inputControl"
                       [(ngModel)]="query"
                       bindLabel="text"
                       bindValue="id"
                       [placeholder]="column.getFilterConfig().placeholder"
            >
            </ng-select>
        </div>
    `
})
export class SelectFilterComponent extends DefaultFilter implements OnInit {

    formGroup: FormGroup;
    inputControl = new FormControl();
    options: any[] = [];

    // TODO: if this module will be exported from ngx-backend, change this logic and use simple Http service
    constructor(private _apiService: ApiService) {
        super();
        this.formGroup = new FormGroup({
            select: this.inputControl
        });
        this.delay = 0;
    }

    ngOnInit() {
        this.loadOptions();
        (this.inputControl.valueChanges as any)
            .skip(1)
            .distinctUntilChanged()
            .debounceTime(this.delay)
            .subscribe((value: string) => this.setFilter());
    }

    private loadOptions(): void {
        if (this.column.getFilterConfig().options instanceof Array) {
            this.options = this.column.getFilterConfig().options;
        } else {
            const endpoint = this.column.getFilterConfig().options;
            this._apiService.get(endpoint)
                .then((response) => {
                    this.options = response;
                })
                .catch((response: ErrorResponse) => {
                    // TODO: decide what to do if select options can't be loaded (back to prev page?, alert?, message?)
                    console.log(response.error);
                });
        }
    }
}
