import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {CloudinaryField, Media, MediaLibraryParams} from '../../interfaces/form-field-file';
import {ApiService, ErrorResponse} from '../../../../../api/api.service';
import {UtilsService} from '../../../../../services/utils.service';
import {ToastsService} from '../../../../../services/toasts.service';
import {environment} from '../../../../../../environments/environment';
import {BaseInputComponent} from '../base-input/base-input.component';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {SelectData} from '../select/select.component';

declare const $: any;

@Component({
    selector: 'app-cloudinary-library',
    templateUrl: './cloudinary-library.component.html',
    styleUrls: ['./cloudinary-library.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CloudinaryLibraryComponent extends BaseInputComponent implements OnInit, OnDestroy {

    @Input() field: CloudinaryField;

    isLoading: boolean;
    data: Media[] = [];
    activeMedia: Media = null;
    selection: Media[];
    count: number;
    pages: number[];

    params: MediaLibraryParams;

    // Search
    typeAhead: EventEmitter<string> = new EventEmitter<string>();
    searchOptions: SelectData[];
    search: any;

    // Tags
    typeAhead_tag: EventEmitter<string> = new EventEmitter<string>();
    tagsOptions: SelectData[];
    tags: any;

    constructor(private _apiService: ApiService,
                private _cd: ChangeDetectorRef,
                private _toast: ToastsService) {
        super();
    }

    ngOnInit() {
        this.isLoading = false;
        this.count = 0;
        this.reset();
        this.initPages();
        // TODO: call this.reload();
        this.typeListener();
    }

    ngOnDestroy() {
    }

    // When user types in select
    private typeListener(): void {
        // Search
        this.typeAhead.pipe(
            distinctUntilChanged(),
            debounceTime(300),
            switchMap(tag => this._apiService.get(this.field.options.api.searchEndpoint, {search: tag}))
        ).subscribe(data => {
            this._cd.markForCheck();
            this.searchOptions = data;
        }, (err) => {
            console.log(err);
            this.searchOptions = [];
        });

        // Tags
        this.typeAhead_tag.pipe(
            distinctUntilChanged(),
            debounceTime(300),
            switchMap(tag => this._apiService.get(this.field.options.api.searchEndpoint, {search: tag}))
        ).subscribe(data => {
            this._cd.markForCheck();
            this.tagsOptions = data;
        }, (err) => {
            console.log(err);
            this.tagsOptions = [];
        });
    }

    reset() {
        this.params = {
            page: 1,
            perPage: 12
        };
        this.data = [];

        // TODO: remove mock when api available
        this.data = [
            {
                id: 1,
                type: 'image/jpg',
                url: 'http://via.placeholder.com/350x150/02b98f',
                name: 'test image with a very very long long long long name',
                tags: [{id: 1, name: 'tag1'}, {id: 2, name: 'tag2'}]
            },
            {
                id: 2,
                type: 'image/jpg',
                url: 'http://via.placeholder.com/350x350/2ca9d6',
                name: 'test image',
                tags: [{id: 1, name: 'tag1'}, {id: 2, name: 'tag2'}]
            },
            {
                id: 3,
                type: 'image/jpg',
                url: 'http://via.placeholder.com/800x200/fdc02f',
                name: 'test image',
                tags: [{id: 5, name: 'tag5'}]
            },
            {
                id: 4,
                type: 'image/jpg',
                url: 'http://via.placeholder.com/700x750/67c2dd',
                name: 'test image',
                tags: [{id: 5, name: 'tag5'}, {id: 2, name: 'tag2'}]
            },
            {
                id: 5,
                type: 'image/jpg',
                url: 'http://via.placeholder.com/150x150/f66d6e',
                name: 'test image',
                tags: [{id: 3, name: 'tag3'}, {id: 2, name: 'tag2'}]
            }
            ];
        this.selection = [];
    }

    removeTag(tag: { id: number, name: string }) {
        console.log('Remove tag from media');
        console.log(tag);

        const index = UtilsService.containsObject(tag, this.activeMedia.tags);
        this.activeMedia.tags.splice(index, 1);

        this._apiService.post(this.field.options.api.deleteTagsEndpoint, {
            medias: this.activeMedia,
            tag: tag
        }).then((response) => {
            this.reload();
        }).catch((response: ErrorResponse) => {
            this._toast.error(response.error);
        });
    }

    onImageError($event: any): void {
        $event.target.src = environment.assets.imageError;
    }

    // ------------------------- Pagination -----------------------------------------
    shouldShowPagination(): boolean {
        return this.count > this.params.perPage;
    }

    initPages() {
        const pagesCount = this.getLastPage();
        let showPagesCount = 4;
        showPagesCount = pagesCount < showPagesCount ? pagesCount : showPagesCount;
        this.pages = [];

        if (this.shouldShowPagination()) {

            let middleOne = Math.ceil(showPagesCount / 2);
            middleOne = this.params.page >= middleOne ? this.params.page : middleOne;

            let lastOne = middleOne + Math.floor(showPagesCount / 2);
            lastOne = lastOne >= pagesCount ? pagesCount : lastOne;

            const firstOne = lastOne - showPagesCount + 1;

            for (let i = firstOne; i <= lastOne; i++) {
                this.pages.push(i);
            }
        }
    }

    paginate(page: number): boolean {
        this.params.page = page;
        // this.getData();
        this.initPages();
        return false;
    }

    getCurrentPage(): number {
        return this.params.page;
    }

    getPages(): number[] {
        return this.pages;
    }

    getLastPage(): number {
        return Math.ceil(this.count / this.params.perPage);
    }

    // -------------------------------------------------------------------------------

    activateMedia($event: any, media: Media): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.activeMedia = media;
        $('#library-wrapper').removeClass('media-closed');
    }

    closeMedia() {
        $('#library-wrapper').addClass('media-closed');
        setTimeout(() => {
            this.activeMedia = null;
        }, 500);
    }

    bulkSelection($event: any) {
        $event.preventDefault();
        $event.stopPropagation();

        if (this.selection.length === this.data.length) {
            this.data.forEach((media: Media) => {
                this.selectMedia($event, media, false);
            });
        } else {
            this.data.forEach((media: Media) => {
                this.selectMedia($event, media, true);
            });
        }
    }

    onSearch() {
        this.reload();
    }

    addTags() {
        console.log('Add tags to selection');
        console.log(this.tags);

        this._apiService.post(this.field.options.api.addTagsEndpoint, {
            medias: this.selection,
            tags: this.tags
        }).then((response) => {
            this.reload();
        }).catch((response: ErrorResponse) => {
            this._toast.error(response.error);
        });
    }


    // ------------------------- Api -------------------------------------------------
    private reload(reset?: boolean) {
        if (reset) {
            this.reset();
        }
        this.getCount()
            .then((res: { count: number }) => {
                this.count = res.count;
                this.initPages();
                this.getData();
            })
            .catch((response: ErrorResponse) => {
                this.isLoading = false;
                this._toast.error(response.error);
            });
    }

    private getCount(): Promise<any> {
        this.composeParams();
        return this._apiService.get(this.field.options.api.dataEndpoint + '/count', this.params);
    }

    private getData(): void {
        this.isLoading = true;
        this.composeParams();
        this._apiService.get(this.field.options.api.dataEndpoint, this.params)
            .then((data) => {
                this.isLoading = false;
                this.data = data;
                // TODO: this.checkSelection();
            })
            .catch((response: ErrorResponse) => {
                this.isLoading = false;
                this._toast.error(response.error);
            });
    }

    private composeParams(): void {
        if (this.search.length === 0) {
            this.params.search = null;
        } else {
            this.params.search = JSON.stringify(this.search);
        }
    }

    // -------------------------------------------------------------------------------


    // ------------------------- Selection  -----------------------------------------
    selectMedia($event: any, media: Media, add?: boolean): void {
        $event.preventDefault();
        $event.stopPropagation();

        const index = UtilsService.containsObject(media, this.selection);
        if (index > -1) {
            if (!add) {
                media.selected = false;
                this.selection.splice(index, 1);
            }
        } else {
            media.selected = true;
            this.selection.push(media);
        }
    }

    private checkSelection(): void {
        this.data.forEach((media: Media) => {
            this.selection.forEach((selected: Media) => {
                if (media.id === selected.id) {
                    media.selected = true;
                }
            });
        });
    }
}
