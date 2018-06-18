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
import {Language, LanguageService} from '../../../../services/language.service';

declare const $: any;

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FileUploadComponent extends BaseInputComponent implements OnInit, OnDestroy {

    @Input() field: FormFieldFile;
    @Input() putFilesOnLanguages: boolean;
    @Input() currentLang: Language;

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

    @ViewChild('fileUpload') _fileUpload: ElementRef;

    private _subscription = Subscription.EMPTY;

    constructor(private _renderer: Renderer,
                private _toastsService: ToastsService,
                private _apiService: ApiService,
                private _langService: LanguageService) {
        super();
    }

    ngOnInit() {
        console.log('[FILE UPLOAD] On Init');
        if (this.field.options.multiple) {
            this.maxFiles = this.field.options.maxFiles ? this.field.options.maxFiles : 0;
        } else {
            this.maxFiles = 1;
        }

        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.createAllowedContentTypes();

        /** Load entity image (if added from duplicate or edit) */
        if (!this.putFilesOnLanguages || this.isEdit) { // TODO: test when duplicate from list
            this._subscription = this.getControl().valueChanges.first().subscribe(data => {
                if (this.uploadedFiles.length === 0) {
                    if (data instanceof Array) {
                        data.forEach((item) => {
                            this.handleResponse(item, 200);
                        });
                    } else {
                        this.handleResponse(data, 200);
                    }
                }
            });
        }

    }

    ngOnDestroy() {
        if (this._subscription !== null) {
            this._subscription.unsubscribe();
        }

        this.removeAllFiles();
        this.uploadedFiles = [];
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

    bringFileSelector(): boolean {
        if (this.showMediaLibrary) {
            this.closeMediaLibrary();
        }
        this._renderer.invokeElementMethod(this._fileUpload.nativeElement, 'click');
        return false;
    }

    /** Sometimes, Google Cloud takes a few seconds to make the image accessible */
    private retryUrl($event: any, url: string): void {
        setTimeout(() => {
            $event.target.src = url;
        }, 2000);
    }

    canUpload(): boolean {
        return this.uploadedFiles.length === 0 || ((this.maxFiles > 0 && this.uploadedFiles.length < this.maxFiles) || this.maxFiles === 0);
    }

    onUploadOutput(output: UploadOutput): void {
        switch (output.type) {
            case 'allAddedToQueue': {
                if (this.files.length > 0) {
                    this.startUpload();
                }
            }
                break;
            case 'addedToQueue': {
                if (this.canUpload()) {
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
                this.handleResponse(output.file.response, output.file.responseStatus);
            }
                break;
            default: {

            }
                break;
        }
    }

    private startUpload(): void {
        this.isLoading = true;

        console.log(this.isLoading);
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

    private handleResponse(response: any, statusCode: number): void {
        console.log('[HANDLE RESPONSE]');
        console.log(response);
        if (response) {
            if (statusCode !== 200 || response.error) {
                this._toastsService.error('error' in response ? response.error : {});
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

        console.log(formFiles);

        if (this.putFilesOnLanguages) {
            this._langService.getContentLanguages().forEach((lang: Language) => {
                Object.keys(this.form.parent.controls).forEach((key) => {
                    if (lang.isoCode === key) {
                        this.form.parent.controls[key].controls[this.field.key].setValue(formFiles.length > 0 ? formFiles : null);
                    }
                });
            });
        } else {
            this.getControl().setValue(formFiles.length > 0 ? formFiles : null);
        }
    }

    private removeUploadedFile(file: UploadedFile): void {
        this.uploadedFiles = UtilsService.removeObjectFromArray(file, this.uploadedFiles);
        this.updateFormValue();
    }

    /** Media library  */
    openMediaLibrary(): void {
        this.showMediaLibrary = true;
    }

    closeMediaLibrary(): void {
        this.showMediaLibrary = false;
    }

    onConfirmMediaLibrarySelection(selection: Media[] | any): void {
        if (selection) {
            (selection as Media[]).forEach((media: Media) => {
                this.addToUpdatedFiles({
                    id: media.id,
                    url: media.url,
                    type: media.type
                });
            });
        }

        this.closeMediaLibrary();
    }
}
