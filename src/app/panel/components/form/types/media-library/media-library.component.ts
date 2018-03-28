import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Media, MediaLibraryOptions} from '../../interfaces/form-field-file';
import {ApiService, ErrorResponse} from '../../../../../api/api.service';
import {UtilsService} from '../../../../../services/utils.service';
import {ToastsService} from '../../../../../services/toasts.service';
import {environment} from '../../../../../../environments/environment';

declare const $: any;

@Component({
    selector: 'app-media-library',
    templateUrl: './media-library.component.html',
    styleUrls: ['./media-library.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MediaLibraryComponent implements OnInit {

    @Input() show: boolean;
    @Input() options: MediaLibraryOptions;
    @Input() maxFiles: number;
    @Input() allowedContentTypes: any[];

    @Output() confirm: EventEmitter<any> = new EventEmitter<any>();

    isLoading: boolean = false;
    data: Media[] = [];
    selection: Media[];
    count: number = 0;

    pages: number[];
    pagination: { perPage: number, page: number } = {
        perPage: 12,
        page: 1
    };

    constructor(private _apiService: ApiService,
                private _toast: ToastsService) {
    }

    ngOnInit() {
        this.clearSelection();
        if (this.data.length === 0) {
            // init library
            this.isLoading = true;
            this.getCount()
                .then((res: { count: number }) => {
                    this.count = res.count;
                    this.initPages();
                    this.getData();
                })
                .catch((response: ErrorResponse) => {
                    this.isLoading = false;
                    this._toast.error(response.error);
                    this.close();
                });
        }
    }

    private getCount(): Promise<any> {
        return this._apiService.get(this.options.endpoint + '/count', this.composeCountParams());
    }

    private getData(): void {
        this._apiService.get(this.options.endpoint, this.composeParams())
            .then((data) => {
                this.isLoading = false;
                this.data = data;
                this.checkSelection();
            })
            .catch((response: ErrorResponse) => {
                this.isLoading = false;
                this._toast.error(response.error);
                this.close();
            });
    }

    private composeAllowedContentTypesFilter(): Object | null {
        if (this.allowedContentTypes.length > 0) {
            const filter = {
                or: []
            };
            // TODO: parametrizzare 'type'
            this.allowedContentTypes.forEach((type) => {
                filter.or.push({type: {like: '%' + type + '%'}});
            });

            return filter;
        }

        return null;
    }

    private composeParams(): Object {

        const params = {
            where: {
                and: []
            },
            order: null,
            skip: (this.pagination.page - 1) * this.pagination.perPage,
            limit: this.pagination.perPage,
        };

        const typesFilter = this.composeAllowedContentTypesFilter();
        if (typesFilter) {
            params.where.and.push(typesFilter);
        }

        return {
            filter: JSON.stringify(params),
            lang: null
        };

    }

    private composeCountParams(): Object {
        const params = {
            where: {
                and: []
            }
        };

        const typesFilter = this.composeAllowedContentTypesFilter();
        if (typesFilter) {
            params.where.and.push(typesFilter);
        }

        return {
            where: JSON.stringify(params.where),
            lang: null
        };
    }

    selectMedia(event: any, media: Media): void {
        const index = UtilsService.containsObject(media, this.selection);
        if (index > -1) {
            $(event.target).removeClass('selected');
            this.selection.splice(index, 1);
        } else {
            if ((this.maxFiles > 0 && this.selection.length < this.maxFiles) || this.maxFiles === 0) {
                $(event.target).addClass('selected');
                this.selection.push(media);
            }
        }
    }

    checkSelection(): void {
        if (this.selection.length > 0) {
            this.selection.forEach((selectedMedia: Media) => {
                this.data.forEach((dataMedia: Media) => {
                    dataMedia.selected = selectedMedia.id === dataMedia.id;
                });
            });
        }
    }

    close(): void {
        this.confirm.emit();
        this.clearSelection();
    }

    confirmSelection(): void {
        this.confirm.emit(this.selection);
        this.clearSelection();
    }

    clearSelection(): void {
        this.selection = [];
    }

    onImageError($event: any): void {
        $event.target.src = environment.assets.imageError;
    }

    shouldShowPagination(): boolean {
        return this.count > this.pagination.perPage;
    }

    initPages() {
        const pagesCount = this.getLastPage();
        let showPagesCount = 4;
        showPagesCount = pagesCount < showPagesCount ? pagesCount : showPagesCount;
        this.pages = [];

        if (this.shouldShowPagination()) {

            let middleOne = Math.ceil(showPagesCount / 2);
            middleOne = this.pagination.page >= middleOne ? this.pagination.page : middleOne;

            let lastOne = middleOne + Math.floor(showPagesCount / 2);
            lastOne = lastOne >= pagesCount ? pagesCount : lastOne;

            const firstOne = lastOne - showPagesCount + 1;

            for (let i = firstOne; i <= lastOne; i++) {
                this.pages.push(i);
            }
        }
    }

    paginate(page: number): boolean {
        this.pagination.page = page;
        this.getData();
        this.initPages();
        return false;
    }

    getCurrentPage(): number {
        return this.pagination.page;
    }

    getPages(): number[] {
        return this.pages;
    }

    getLastPage(): number {
        return Math.ceil(this.count / this.pagination.perPage);
    }
}
