import {
    Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Renderer, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    FormFieldFile, Media,
    UploadedFile
} from '../../interfaces/form-field-file';
import {UploaderOptions, UploadFile, UploadInput, UploadOutput} from 'ngx-uploader';
import {ApiService} from '../../../../../api/api.service';
import {UtilsService} from '../../../../../services/utils.service';
import {BaseInputComponent} from '../base-input/base-input.component';
import {ToastsService} from '../../../../../services/toasts.service';
import {Subscription} from 'rxjs/Subscription';

declare const $: any;

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FileUploadComponent extends BaseInputComponent implements OnInit, OnDestroy {

    private readonly mediaLibraryMock: Media[] = [
        {
            id: 1,
            type: 'image/jpeg',
            url: 'http://via.placeholder.com/300x300?text=1',
            name: 'File 1'
        },
        {
            id: 2,
            type: 'image/jpeg',
            url: 'http://via.placeholder.com/300x300?text=2',
            name: 'File 2'
        },
        {
            id: 3,
            type: 'image/jpeg',
            url: 'http://via.placeholder.com/300x300?text=3',
            name: 'File 3'
        },
        {
            id: 4,
            type: 'image/jpeg',
            url: 'http://via.placeholder.com/300x300?text=4',
            name: 'File 4'
        }
    ];

    @Input() field: FormFieldFile;

    options: UploaderOptions = {
        concurrency: 1,
        allowedContentTypes: []
    };

    /* Files to upload */
    files: UploadFile[];

    /* Max num of files to upload */
    maxFiles: number;

    /* Files already uploaded */
    uploadedFiles: UploadedFile[] = [];

    uploadInput: EventEmitter<UploadInput>;

    rejected: boolean = false;
    dragOver: boolean = false;
    isLoading: boolean = false;

    showMediaLibrary: boolean = false;
    isMediaLibraryLoading: boolean = false;
    mediaLibrary: Media[] = [];
    mediaLibraryCount: number = 0;
    mediaSelection: Media[] = [];

    @ViewChild('fileUpload') _fileUpload: ElementRef;

    private _subscription = Subscription.EMPTY;

    constructor(private _renderer: Renderer,
                private _toastsService: ToastsService,
                private _apiService: ApiService) {
        super();
    }

    ngOnInit() {

        if (this.field.options.multiple) {
            this.maxFiles = this.field.options.maxFiles ? this.field.options.maxFiles : 0;
        } else {
            this.maxFiles = 1;
        }

        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.createAllowedContentTypes();

        /** Load entity image (if added from duplicate or edit) */
        this._subscription = this.getControl().valueChanges
            .first()
            .subscribe(
                data => {
                    if (this.uploadedFiles.length === 0) {
                        if (data instanceof Array) {
                            data.forEach((item) => {
                                this.handleResponse(item);
                            });
                        } else {
                            this.handleResponse(data);
                        }
                    }
                });

    }

    ngOnDestroy() {
        if (this._subscription !== null) {
            this._subscription.unsubscribe();
        }

        this.removeAllFiles();
        this.uploadedFiles = [];
    }

    get isValid() {
        if (this.getControl().touched) {
            return this.getControl().valid;
        } else {
            return true;
        }
    }

    private createAllowedContentTypes(): void {
        if (this.field.options && this.field.options.allowedContentTypes) {
            this.field.options.allowedContentTypes.forEach((type) => {
                this.options.allowedContentTypes.push(UtilsService.getFileType(type));
            });
        } else {
            this.options.allowedContentTypes = null;
        }
    }

    /**
     * Just to invoke file selection if click on button or input text
     * @returns {boolean}
     */
    private bringFileSelector(): boolean {
        this._renderer.invokeElementMethod(this._fileUpload.nativeElement, 'click');
        return false;
    }

    /** Sometimes, Google Cloud takes a few seconds to make the image accessible */
    private retryUrl($event: any, url: string): void {
        setTimeout(() => {
            $event.target.src = url;
        }, 2000);
    }

    onUploadOutput(output: UploadOutput): void {
        console.log(output);
        switch (output.type) {
            case 'allAddedToQueue': {
                if (this.files.length > 0) {
                    this.startUpload();
                }
            }
                break;
            case 'addedToQueue': {
                if (this.uploadedFiles.length < this.maxFiles) {
                    this.files.push(output.file);
                }
            }
                break;
            case 'uploading': {
                /* update current data in files array for uploading file */
                const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
                this.files[index] = output.file;
            }
                break;
            case 'removed': {
                // remove file from array when removed
                this.files = this.files.filter((file: UploadFile) => file !== output.file);
            }
                break;
            case 'dragOver': {
                this.dragOver = true;
            }
                break;
            case 'dragOut': {
                this.dragOver = false;
            }
                break;
            case 'drop': {
                this.dragOver = false;
            }
                break;
            case 'rejected': {
                // File type not allowed, highlight allowed extensions
                this.isLoading = false;
                this.rejected = true;
                setTimeout(() => {
                    this.rejected = false;
                }, 5000);
            }
                break;
            case 'done': {
                this.isLoading = false;
                this.removeFile(output.file.id);
                this.handleResponse(output.file.response);
            }
                break;
            default: {

            }
                break;
        }
    }

    private startUpload(): void {
        this.isLoading = true;
        console.log('START UPLOAD');
        const event: UploadInput = {
            type: 'uploadAll',
            url: this._apiService.composeUrl(this.field.options.api.upload, true),
            method: 'POST'
        };

        this.uploadInput.emit(event);
    }

    private removeFile(id: string): void {
        this.uploadInput.emit({type: 'remove', id: id});
    }

    private removeAllFiles(): void {
        this.files.forEach((file) => {
            this.removeFile(file.id);
        });
        this._fileUpload.nativeElement.files = null;
    }

    private handleResponse(response: any): void {
        if (response) {
            if (response.error) {
                this._toastsService.error(response.error);
            } else {
                this.addToUpdatedFiles({
                    id: response.id,
                    url: response.url,
                    type: response.type
                });
            }
        }
    }

    private addToUpdatedFiles(file: UploadedFile): void {
        this.uploadedFiles.push(file);
        this.updateFormValue();
    }

    private updateFormValue(): void {
        const formFiles = [];

        for (const uploadedFile of this.uploadedFiles) {
            formFiles.push(uploadedFile.id);
        }

        this.getControl().setValue(formFiles.length > 0 ? formFiles : null);
    }

    private removeUploadedFile(file: UploadedFile): void {
        this.uploadedFiles = UtilsService.removeObjectFromArray(file, this.uploadedFiles);
        this.updateFormValue();
    }

    /** Media library  */
    openMediaLibrary(): void {
        this.showMediaLibrary = true;
        // Initializing media library
        if (this.mediaLibrary.length === 0) {
            this.mediaLibraryCount = this.mediaLibraryMock.length;
            this.isMediaLibraryLoading = true;
            setTimeout(() => {
                this.isMediaLibraryLoading = false;
                this.mediaLibrary = this.mediaLibraryMock;
            }, 500);
        }
    }

    closeMediaLibrary(): void {
        this.showMediaLibrary = false;
    }

    selectMedia(event: any, media: Media): void {
        const index = UtilsService.containsObject(media, this.mediaSelection);
        if (index > -1) {
            $(event.target).removeClass('selected');
            this.mediaSelection.splice(index, 1);
        } else {
            if (this.mediaSelection.length < this.maxFiles) {
                $(event.target).addClass('selected');
                this.mediaSelection.push(media);
            }
        }
    }

    confirmSelection(): void {
        this.closeMediaLibrary();
        this.mediaSelection.forEach((media: Media) => {
            this.addToUpdatedFiles({
                id: media.id,
                url: media.url,
                type: media.type
            });
        });
    }
}
