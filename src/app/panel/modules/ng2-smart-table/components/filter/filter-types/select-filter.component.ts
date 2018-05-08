import {Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';

import {DefaultFilter} from './default-filter';
import {ApiService, ErrorResponse} from '../../../../../../api/api.service';
import {Language, LanguageService} from '../../../../../services/language.service';
import {type} from "os";

declare const $: any;

@Component({
    selector: 'select-filter',
    template: `
        <div [formGroup]="formGroup">
            <ng-select [items]="options"
                       [multiple]="column.filter.multiple"
                       [formControl]="inputControl"
                       [(ngModel)]="query"
                       [appendTo]="'nav'"
                       [closeOnSelect]="true"
                       bindLabel="text"
                       bindValue="id"
                       [placeholder]="column.getFilterConfig().placeholder"
            >
            </ng-select>
        </div>
    `
})
export class SelectFilterComponent extends DefaultFilter implements OnInit, OnChanges {

    @Input() filterValue: any;
    @Input() reloadOptions;

    formGroup: FormGroup;
    inputControl = new FormControl();
    options: any[] = [];

    constructor(private _apiService: ApiService, private _languageService: LanguageService) {
        super();
        this.formGroup = new FormGroup({
            select: this.inputControl
        });
        this.delay = 0;
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if (changes['reloadOptions']) {
            this.loadOptions();
        }

        if (changes['column'] && changes['column'].isFirstChange()) {
            const filter = this.column.getFilter();
            if (typeof filter['default'] !== 'undefined') {
                this.inputControl.setValue(filter['default'], {emitEvent: false});
                this.query = filter['default'];
            }
        }
    }

    ngOnInit() {
        this.loadOptions();
        (this.inputControl.valueChanges as any)
            .skip(1)
            .distinctUntilChanged()
            .debounceTime(this.delay)
            .subscribe((value: any) => {
                this.setFilter();
            });

        this.onScroll();

        if (this.filterValue) {
            let value = this.filterValue;
            if (typeof this.filterValue === 'object') {
                value = this.filterValue['inq'];
            }
            this.query = value;
            this.inputControl.setValue(value, {emitEvent: false});
        }
    }

    private loadOptions(): void {
        if (this.column.getFilterConfig().options instanceof Array) {
            this.options = this.column.getFilterConfig().options;
        } else {
            const endpoint = this.column.getFilterConfig().options;

            /** Add lang if table is multilang */
            const queryParams = {
                lang: null
            };
            if (this.grid.getSetting('lang')) {
                const lang = this._languageService.getCurrentContentTableLang();
                if (lang) {
                    queryParams.lang = lang.isoCode;
                }
            }

            this._apiService.get(endpoint, queryParams)
                .then((response) => {
                    this.options = response;
                })
                .catch((response: ErrorResponse) => {
                    // TODO: decide what to do if select options can't be loaded (back to prev page?, alert?, message?)
                    console.log(response.error);
                });
        }
    }

    private onScroll(): void {
        $('.table-responsive').scroll(function() {
            $('.table-responsive').click();
        });
    }
}
