
import {debounceTime} from 'rxjs/operators';
import {Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';




import {DefaultFilter} from './default-filter';
import {ApiService, ErrorResponse} from '../../../../../../api/api.service';
import {Language, LanguageService} from '../../../../../services/language.service';
import {type} from 'os';
import {Subject} from 'rxjs';



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
                       (keyup)="onSearchType($event.target.value)"
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

    private searchEnabled: boolean;
    private searchSubject: Subject<string>;
    private searchTerm: string;

    constructor(private _apiService: ApiService, private _languageService: LanguageService) {
        super();
        this.formGroup = new FormGroup({
            select: this.inputControl
        });
        this.delay = 0;
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if (!this.searchEnabled && changes['reloadOptions']) {
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

    public onSearchType(value: string): void {
        if (this.searchEnabled) {
            this.searchSubject.next(value);
        }
    }

    ngOnInit() {

        this.searchTerm = '';
        this.searchEnabled = 'search' in this.column.getFilterConfig();

        if (this.searchEnabled) {
            this.searchSubject = new Subject();
        }

        if (!this.searchEnabled) {
            this.loadOptions();
        }

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

        if (this.searchEnabled) {
            this.searchSubject.pipe(debounceTime(500)).subscribe(value => {
                this.searchTerm = value;
                this.loadOptions();
            });
        }
    }

    private loadOptions(): void {

        if (!this.searchEnabled && 'options' in this.column.getFilterConfig() && this.column.getFilterConfig().options instanceof Array) {
            this.options = this.column.getFilterConfig().options;
        } else {
            let endpoint = '';
            if (this.searchEnabled) {
                endpoint = this.column.getFilterConfig().search.endpoint;
            } else {
                if ('options' in this.column.getFilterConfig()) {
                    endpoint = this.column.getFilterConfig().options;
                }
            }
            if (endpoint.trim().length === 0) {
                return;
            }

            /** Add lang if table is multilang */
            const queryParams = {
                lang: null,
                search: null
            };

            /** Search term */
            if (this.searchEnabled && this.searchTerm) {
                queryParams.search = this.searchTerm.trim();
            }

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
        $('.table-responsive').scroll(function () {
            $('.table-responsive').click();
        });
    }
}
