import {
    Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Renderer2, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    FormFieldFile, Media,
    UploadedFile
} from '../../interfaces/form-field-file';
import { UploaderOptions, UploadFile, UploadInput, UploadOutput } from 'ngx-uploader';
import { ApiService } from '../../../../../api/api.service';
import { UtilsService } from '../../../../../services/utils.service';
import { BaseInputComponent } from '../base-input/base-input.component';
import { ToastsService } from '../../../../../services/toasts.service';
import { Subscription } from 'rxjs';
import { Language, LanguageService } from '../../../../services/language.service';
import { DragulaService } from 'ng2-dragula';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import {CopyLangHelperService} from '../../copy-lang-chooser/copy-lang-helper.service';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FileUploadComponent extends BaseInputComponent implements OnInit, OnDestroy {

    @Input() field: FormFieldFile;
    @Input() putFilesOnLanguages?: boolean;
    @Input() copyOnLanguages?: boolean;
    @Input() currentLang: Language;

    options: UploaderOptions = {
        concurrency: 1,
        allowedContentTypes: []
    };

    /* Files to upload */
    files: UploadFile[];

    /* Max num of files to upload */
    maxFiles: number;

    uploadInput: EventEmitter<UploadInput>;

    rejected = false;
    dragOver = false;
    isLoading = false;

    showMediaLibrary = false;

    filesList: any[];

    copyToLang = false; // putFilesOnLanguage checkbox

    @ViewChild('fileUpload') _fileUpload: ElementRef;

    private _subscription = Subscription.EMPTY;
    private _routeSubscription = Subscription.EMPTY;

    constructor(private _renderer: Renderer2,
        private _route: ActivatedRoute,
        private _toastsService: ToastsService,
        private _copyLangHelper: CopyLangHelperService,
        private _apiService: ApiService,
        public _langService: LanguageService,
        private _dragulaService: DragulaService) {
        super();
    }

    ngOnInit() {
        this.updateFilesValues(this.getControl().value);

        if (this.field.options.multiple) {
            this.maxFiles = this.field.options.maxFiles ? this.field.options.maxFiles : 0;
        } else {
            this.maxFiles = 1;
        }

        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.createAllowedContentTypes();

        /** Load entity image (if added from duplicate or edit) */
        this._subscription = this.getControl().valueChanges.subscribe(data => {
          this.updateFilesValues(data);
        });

        if (this.field.options.api) {
            this.field.options.api.uploadEndpoint = this.field.options.api.upload;

            if (this.field.options.api.upload.indexOf(':id') > -1) {
                this._routeSubscription = this._route.params.subscribe((params: any) => {
                    const id = params['id'];
                    if (id) {
                        this.field.options.api.uploadEndpoint = this.field.options.api.upload.replace(':id', id);
                    }
                });
            }
        } else if (this._routeSubscription !== null) {
            this._routeSubscription.unsubscribe();
        }
    }



    updateFilesValues(data: any) {
      const d: any[] = data instanceof Array
        ? data
        : [data];

      this.filesList = d.filter(e => !! e);
      this.getControl().setValue(this.filesList.length > 0 ? this.filesList : null, {emitEvent: false});
    }



    ngOnDestroy() {
        this._dragulaService.destroy(this.getUniqueKey());

        if (this._subscription !== null) {
            this._subscription.unsubscribe();
        }

        if (this._routeSubscription !== null) {
            this._routeSubscription.unsubscribe();
        }

        this.removeAllFiles();
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

    /** Sometimes, Google Cloud takes a few seconds to make the image accessible */
    public retryUrl($event: any, url: string): void {
        setTimeout(() => {
            $event.target.src = url;
        }, 2000);
    }

    public bringFileSelector(): boolean {
        if (this.showMediaLibrary) {
            this.closeMediaLibrary();
        }
        /** invokeElementMethod removed from Renderer2 */
        // this._renderer.invokeElementMethod(this._fileUpload.nativeElement, 'click');
        this._fileUpload.nativeElement.click();

        return false;
    }

    public canUpload(): boolean {
        return (!this.getControl().value || (this.getControl().value && this.getControl().value.length === 0)) ||
            ((this.maxFiles > 0 && this.getControl().value && this.getControl().value.length < this.maxFiles) || this.maxFiles === 0);
    }

    public onUploadOutput(output: UploadOutput): void {
        switch (output.type) {
            case 'allAddedToQueue': {
                if (this.files.length > 0) {
                    this.startUpload();
                }
              break;
            }
            case 'addedToQueue': {
                if (this.canUpload()) {
                    this.files.push(output.file);
                }
              break;
            }
            case 'uploading': {
                /* update current data in files array for uploading file */
                const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
                this.files[index] = output.file;
              break;
            }
            case 'removed': {
              // remove file from array when removed
              this.removeFile(output.file);
              break;
            }
            case 'dragOver': {
                this.dragOver = true;
              break;
            }
            case 'dragOut': {
                this.dragOver = false;
              break;
            }
            case 'drop': {
                this.dragOver = false;
              break;
            }

            case 'rejected': {
                // File type not allowed, highlight allowed extensions
                this.isLoading = false;
                this.rejected = true;

                setTimeout(() => {
                    this.rejected = false;
                }, 5000);
              break;
            }
            case 'done': {
                this.isLoading = false;
                this.removeFile(output.file);
                this.handleResponse(output.file);
              break;
            }
        }

      console.log('[OUTPUT] ', JSON.stringify(output));
    }

    private async startUpload(): Promise<void> {
        this.isLoading = true;

      /*
       * since the upload directive does not pass through the angular http client at all, I launch the refresh of the token regardless,
       * so that when uploading the uploader will find the token already renewed
       */

      if (environment.auth.refreshToken?.endpoint) {
        await this._apiService.refreshAndStoreToken();
      }

      const event: UploadInput = {
        type: 'uploadAll',
        url: this._apiService.composeUrl(this.field.options.api.uploadEndpoint, true),
        method: 'POST'
      };
      this.uploadInput.emit(event);
    }

    private removeFile(file: UploadFile): void {

      if (this._fileUpload.nativeElement.files.length === 1) {
        this._fileUpload.nativeElement.files = null;
        this.uploadInput.emit({type: 'removeAll'});
      } else {
        this.uploadInput.emit({type: 'remove', file});
      }
    }

    private removeAllFiles(): void {
        this.files.forEach((file) => {
            this.removeFile(file);
        });
        this._fileUpload.nativeElement.files = null;
    }

    private handleResponse(file: UploadFile): void {
      const response = file.response;
      const statusCode = file.responseStatus;

        // console.log('[HANDLE RESPONSE]');
        // console.log('my file: ', response);
        if (response) {
            if ((statusCode !== 200 && statusCode !== 201) || response.error) {
              const index = this.files.findIndex(localFile => typeof file !== 'undefined' && localFile.id === file.id);
              this.files.splice(index, 1);
              this._toastsService.error('error' in response ? response.error : {});
            } else {
                this.updateFormValue({
                    id: response.id,
                    url: response.url,
                    type: response.type,
                    name: response.name
                }, false);
            }
        }
    }

    private updateFormValue(file: UploadedFile, remove?: boolean): void {
        console.log('Updating form Value with file:');
        console.log(file.id);
        console.log(remove ? 'Remove' : 'Add');

        let files = this.filesList || [];
        if (remove) {
            files = UtilsService.removeObjectFromArray(file, files);
        } else {
            if (this.maxFiles === 1) {
                files = [file];
            } else {
                files.push(file);
            }
        }

        if (this.copyToLang && !remove) {
            if (this.currentLang && this.putFilesOnLanguages) {
                this._copyLangHelper.contentLanguages.forEach((lang) => {
                    if (lang.checked) {
                        Object.keys(this.form.parent.controls).forEach((key) => {
                            if (lang.isoCode === key) {
                                let currentValue = this.form.parent.controls[key].controls[this.field.key].value || [];
                                if (this.maxFiles === 1) {
                                    currentValue = [file];
                                } else {
                                    currentValue.push(file);
                                }
                                const unique = UtilsService.uniqueArray(currentValue, 'id');

                                this.form.parent.controls[key].controls[this.field.key].setValue(
                                    unique.length > 0 ? unique : null
                                );
                            }
                        });
                    }
                });
            }
        } else {
            this.getControl().setValue(files.length > 0 ? files : null);
        }
    }

    public removeUploadedFile(file: UploadedFile): void {
        this.updateFormValue(file, true);
    }


    /** -------------------- Media library -------------------- */
    public openMediaLibrary(): void {
        this.showMediaLibrary = true;
    }

    public closeMediaLibrary(): void {
        this.showMediaLibrary = false;
    }

    public onConfirmMediaLibrarySelection(selection: Media[] | any): void {
        if (selection) {
            (selection as Media[]).forEach((media: Media) => {
                this.updateFormValue({
                    id: media.id,
                    url: media.url,
                    type: media.type
                }, false);
            });
        }

        this.closeMediaLibrary();
    }

}
