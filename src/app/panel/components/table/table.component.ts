import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {TableSettings} from './interfaces/table-settings';
import {ApiService} from '../../../api/api.service';
import {TableFilter} from './interfaces/table-filter';
import {TableSort} from './interfaces/table-sort';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnInit {

    @Input() settings: TableSettings;

    private isLoading: boolean = false;
    public data: any[];

    constructor(private _apiService: ApiService) {
    }

    ngOnInit() {
        this.getData();
    }

    private getData(filter?: TableFilter, sort?: TableSort): void {
        this.isLoading = true;
        this._apiService.get(this.settings.api.endpoint)
            .then((response) => {
                this.isLoading = false;
                this.data = response;
            })
            .catch((response) => {
                this.isLoading = false;
                console.log(response);
            });
    }

    onAction(event: any) {
        console.log('ON Action');
        console.log(event);
    }

    onCreate(event: any) {
        console.log('ON Create');
        console.log(event);
    }

    onRowSelect(event: any) {
        console.log('ON Select row(s)');
        console.log(event);
    }

    onFilter(event: any) {
        console.log('ON filter');
        console.log(event);
    }

    onPagination(event: { page: number, perPage: number }) {
        console.log('ON pagination');
        console.log(event);
    }

    onSort(event: { column: string, direction: string }) {
        console.log('ON sort');
        console.log(event);
    }
}
