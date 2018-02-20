import {
    Component, ElementRef, EventEmitter, Input, OnInit, Renderer, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {
    FormFieldFile, GoogleCloudStorageResponse, isGoogleCloudStorageResponse, isLocalStorageResponse,
    LocalStorageResponse,
    UploadedFile
} from '../../interfaces/form-field-file';
import {UploaderOptions, UploadFile, UploadInput, UploadOutput} from 'ngx-uploader';
import {ApiService} from '../../../../../api/api.service';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../../../environments/environment';
import {UtilsService} from '../../../../../services/utils.service';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FileUploadComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() field: FormFieldFile;

    options: UploaderOptions = {
        concurrency: 1,
        allowedContentTypes: []
    };

    /* Files to upload */
    files: UploadFile[];

    /* Files already uploaded */
    uploadedFiles: UploadedFile[] = [];

    uploadInput: EventEmitter<UploadInput>;

    rejected = false;
    dragOver = false;
    isLoading = false;

    @ViewChild('fileUpload') _fileUpload: ElementRef;

    static composeFileUrl(response: GoogleCloudStorageResponse | LocalStorageResponse): string {
        if (isLocalStorageResponse(response)) {
            const name = response.name ? response.name : response.hash + '.' + response.extension;
            return environment.api.baseFilesUrl + response.container + '/' + name;
        } else if (isGoogleCloudStorageResponse(response)) {
            if (!response.url) {
                if (response.thumbnails) {
                    return response.thumbnails.small;
                } else {

                }
            } else {
                return response.url;
            }
        }
    }

    constructor(private _renderer: Renderer,
                private _toastService: ToastrService,
                private _apiService: ApiService) {
    }

    ngOnInit() {
        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.createAllowedContentTypes();

        /** Load entity image (if edit) */
        this.form.controls[this.field.key].valueChanges
            .first()
            .subscribe(
                data => {
                    if (data != null) {
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

    get isValid() {
        if (this.form.controls[this.field.key].value === null || this.form.controls[this.field.key].value === []) {
            return true;
        } else {
            return this.form.controls[this.field.key].valid;
        }
    }

    private createAllowedContentTypes(): void {
        if (this.field.options && this.field.options.allowedContentTypes) {
            this.field.options.allowedContentTypes.forEach((type) => {
                let correctTypeName = '';

                switch (type) {
                    case '.jpg':
                    case '.jpeg':
                    case '.png': {
                        correctTypeName = 'image/' + type.split('.')[1];
                    }
                        break;
                    case '.json':
                    case '.zip':
                    case '.pdf': {
                        correctTypeName = 'application/' + type.split('.')[1];
                    }
                        break;
                    case '.xml':
                    case '.csv': {
                        correctTypeName = 'text/' + type.split('.')[1];
                    }
                        break;
                    case '.txt': {
                        correctTypeName = 'text/plain';
                    }
                        break;
                    default: {
                        correctTypeName = type;
                    }
                        break;
                }

                this.options.allowedContentTypes.push(correctTypeName);
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

    private onUploadOutput(output: UploadOutput): void {
        switch (output.type) {
            case 'allAddedToQueue': {
                // Call this.startUpload() if files must be uploaded immediately after being selected
            }
                break;
            case 'addedToQueue': {
                this.files.push(output.file);
            }
                break;
            case 'uploading': {
                // update current data in files array for uploading file
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
            url: ApiService.composeUrl(this.field.options.api.upload),
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
    }

    private handleResponse(response: any): void {
        if (response.error) {
            this._toastService.error(response.error.message, 'Error');
        } else {
            if (isLocalStorageResponse(response)) {
                this.addToUpdatedFiles({
                    id: response.id,
                    container: response.container,
                    url: FileUploadComponent.composeFileUrl(response),
                    name: response.originalName,
                    type: response.type
                });
            } else if (isGoogleCloudStorageResponse(response)) {
                this.addToUpdatedFiles({
                    id: response.media.id,
                    container: response.file.container,
                    url: FileUploadComponent.composeFileUrl(response),
                    name: response.media.originalName,
                    type: response.media.mimeType
                });
            }
        }
    }

    private addToUpdatedFiles(file: UploadedFile): void {
        this.uploadedFiles.push(file);
        this.updateFormValue();
    }

    private updateFormValue(): void {
        this.form.controls[this.field.key].setValue(this.uploadedFiles.length > 0 ? this.uploadedFiles : null);
    }

    private removeUploadedFile(file: UploadedFile): void {
        if (this.field.options.api.delete) {
            this._apiService.delete(this.field.options.api.delete + '/' + file.id)
                .then((response) => {
                    this._toastService.success(file.name + ' deleted successfully');
                    this.uploadedFiles = UtilsService.removeObjectFromArray(file, this.uploadedFiles);
                    this.updateFormValue();
                })
                .catch((response) => {
                    this._toastService.error('Can\'t delete ' + file.name + ', try again later');
                });
        }
    }
}
