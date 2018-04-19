import {
    Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange,
    ViewEncapsulation
} from '@angular/core';
import {Media, MediaLibraryOptions, MediaLibraryParams, UploadedFile} from '../../interfaces/form-field-file';
import {ApiService, ErrorResponse} from '../../../../../api/api.service';
import {UtilsService} from '../../../../../services/utils.service';
import {ToastsService} from '../../../../../services/toasts.service';
import {environment} from '../../../../../../environments/environment';
import {FormControl} from '@angular/forms';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import {Subscription} from 'rxjs/Subscription';

declare const $: any;

@Component({
    selector: 'app-media-library',
    templateUrl: './media-library.component.html',
    styleUrls: ['./media-library.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MediaLibraryComponent implements OnInit, OnChanges, OnDestroy {

    @Input() show: boolean;
    @Input() options: MediaLibraryOptions;
    @Input() uploadedFiles: UploadedFile[];
    @Input() maxFiles: number;
    @Input() allowedContentTypes: string[];

    @Output() confirm: EventEmitter<any> = new EventEmitter<any>();

    isLoading: boolean;
    data: Media[] = [];
    selection: Media[];
    count: number;
    pages: number[];

    private params: MediaLibraryParams;

    subscriptionInputControl = Subscription.EMPTY;
    inputControl = new FormControl();

    constructor(private _apiService: ApiService,
                private _toast: ToastsService) {
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if (changes['show']) {
            if (changes['show'].currentValue === true) {
                if (this.data.length === 0) {
                    this.reload();
                }
            }
        }
    }

    ngOnInit() {
        this.isLoading = false;
        this.count = 0;
        this.params = {
            page: 1,
            perPage: 12,
            search: null,
            types: JSON.stringify(this.allowedContentTypes)
        };
        this.reset();
        this.initPages();
        this.onFilterChange();
    }

    ngOnDestroy() {
        this.subscriptionInputControl.unsubscribe();
    }

    private onFilterChange() {
        this.subscriptionInputControl = this.inputControl.valueChanges.skip(1).distinctUntilChanged().debounceTime(300)
            .subscribe((value: string) => {
                this.params.search = value;
                this.params.page = 1;
                this.reload();
            });
    }

    private reload() {
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

    private reset() {
        this.params.search = null;
        this.params.page = 1;
        this.data = [];
        this.selection = [];
    }

    private getCount(): Promise<any> {
        return this._apiService.get(this.options.endpoint + '/count', this.composeParams(true));
    }

    private getData(): void {
        this.isLoading = true;
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

    private composeParams(count?: boolean): Object {
        const params: any = this.params;

        if (this.uploadedFiles.length > 0) {
            params.skipIds = [];
            this.uploadedFiles.forEach((file: UploadedFile) => {
                params.skipIds.push(file.id);
            });
        }

        if (count) {
            delete params.page;
            delete params.perPage;
        }

        return params;
    }

    selectMedia(event: any, media: Media): void {
        const index = UtilsService.containsObject(media, this.selection);
        if (index > -1) {
            media.selected = false;
            this.selection.splice(index, 1);
        } else {
            if ((this.maxFiles > 0 && this.selection.length < this.maxFiles) || this.maxFiles === 0) {
                media.selected = true;
                this.selection.push(media);
            }
        }
    }

    unSelectMedia(event: any, media: Media): void {
        const index = UtilsService.containsObject(media, this.selection);
        if (index > -1) {
            media.selected = false;
            this.selection.splice(index, 1);
        }

        this.data.forEach((item: Media) => {
            if (item.id === media.id) {
                item.selected = false;
            }
        });
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

    close(): void {
        this.confirm.emit();
        this.subscriptionInputControl.unsubscribe();
        this.reset();
    }

    confirmSelection(): void {
        this.confirm.emit(this.selection);
        this.subscriptionInputControl.unsubscribe();
        this.reset();
    }

    onImageError($event: any): void {
        $event.target.src = environment.assets.imageError;
    }

    shouldShowPagination(): boolean {
        return this.count > this.params.perPage;
    }

    private initPages() {
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
        this.getData();
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
}
