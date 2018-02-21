import {
    Component, Input, Output, EventEmitter, OnChanges, SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {DataSource} from '../../lib/data-source/data-source';

@Component({
    selector: 'ng2-smart-table-pager',
    styleUrls: ['./pager.component.scss'],
    templateUrl: './pager.html',
    encapsulation: ViewEncapsulation.None
})
export class PagerComponent implements OnChanges {

    @Input() source: DataSource;

    @Output() changePage = new EventEmitter<any>();
    @Output() changePerPage = new EventEmitter<any>();

    protected pages: Array<any>;
    protected page: number;
    protected count: number = 0;
    protected perPage: number;
    protected perPageOptions: any[] = [];

    protected dataChangedSub: Subscription;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['source']) {
            if (!changes['source'].firstChange) {
                this.dataChangedSub.unsubscribe();
            }
            this.dataChangedSub = this.source.onChanged().subscribe((dataChanges) => {
                this.page = this.source.getPaging().page;
                this.perPage = this.source.getPaging().perPage;
                this.count = this.source.count();
                if (this.isPageOutOfBounce()) {
                    this.source.setPage(--this.page);
                }

                this.processPageChange(dataChanges);
                this.initPages();
                this.initPerPage();
            });
        }
    }

    /**
     * We change the page here depending on the action performed against data source
     * if a new element was added to the end of the table - then change the page to the last
     * if a new element was added to the beginning of the table - then to the first page
     * @param changes
     */
    processPageChange(changes: any) {
        if (changes['action'] === 'prepend') {
            this.source.setPage(1);
        }
        if (changes['action'] === 'append') {
            this.source.setPage(this.getLast());
        }
    }

    shouldShowPagination(): boolean {
        return this.source.count() > this.perPage;
    }

    shouldShowPerPage(): boolean {
        return this.source.count() > 10;
    }

    paginate(page: number): boolean {
        // this.source.setPage(page);
        this.page = page;
        this.changePage.emit({page});
        return false;
    }

    getPage(): number {
        return this.page;
    }

    getPages(): Array<any> {
        return this.pages;
    }

    getLast(): number {
        return Math.ceil(this.count / this.perPage);
    }

    isPageOutOfBounce(): boolean {
        return (this.page * this.perPage) >= (this.count + this.perPage) && this.page > 1;
    }

    initPages() {
        const pagesCount = this.getLast();
        let showPagesCount = 4;
        showPagesCount = pagesCount < showPagesCount ? pagesCount : showPagesCount;
        this.pages = [];

        if (this.shouldShowPagination()) {

            let middleOne = Math.ceil(showPagesCount / 2);
            middleOne = this.page >= middleOne ? this.page : middleOne;

            let lastOne = middleOne + Math.floor(showPagesCount / 2);
            lastOne = lastOne >= pagesCount ? pagesCount : lastOne;

            const firstOne = lastOne - showPagesCount + 1;

            for (let i = firstOne; i <= lastOne; i++) {
                this.pages.push(i);
            }
        }
    }

    initPerPage() {
        if (this.perPageOptions.length <= 0) {
            const perPageLength = Math.ceil(this.count / 5) <= 5 ? Math.ceil(this.count / 5) : 5;
            for (let i = 0; i < perPageLength; i++) {
                this.perPageOptions.push((i + 1) * 5);
            }
        }
    }

    perPageChange(perPage: number): boolean {
        this.perPage = perPage;
        // this.source.setPaging(1, this.perPage);
        this.changePerPage.emit({perPage});
        return false;
    }
}
