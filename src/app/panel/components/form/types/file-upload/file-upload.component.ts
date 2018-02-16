import {
    Component, ElementRef, EventEmitter, Input, OnInit, Renderer, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormFieldFile} from '../../interfaces/form-field-file';
import {UploaderOptions, UploadFile, UploadInput, UploadOutput} from 'ngx-uploader';
import {ApiService} from '../../../../../api/api.service';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FileUploadComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() field: FormFieldFile;


    options: UploaderOptions;
    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;

    dragOver: boolean;
    isLoading: boolean = false;

    @ViewChild('fileUpload') _fileUpload: ElementRef;

    constructor(private _renderer: Renderer) {
    }

    ngOnInit() {
        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    }

    /**
     * Just to invoke file selection if click on button or input text
     * @returns {boolean}
     */
    private bringFileSelector(): boolean {
        this._renderer.invokeElementMethod(this._fileUpload.nativeElement, 'click');
        return false;
    }

    private onUploadOutput(output: UploadOutput): void {
        switch (output.type) {
            case 'allAddedToQueue': {
                // when all files added in queue
                // uncomment this if you want to auto upload files when added
                // const event: UploadInput = {
                //   type: 'uploadAll',
                //   url: '/upload',
                //   method: 'POST',
                //   data: { foo: 'bar' }
                // };
                // this.uploadInput.emit(event);
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
            case 'done': {
                this.isLoading = false;
                this.removeAllFiles();
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
         method: 'POST',
         concurrency: 1
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
        console.log(response);
    }

    updateFormValue(): void {
        // TODO: update form value when files are updated (with IDs)
        // this.form.controls[this.field.key].setValue(this.uploadedFiles.length > 0 ? this.uploadedFiles : null);
    }
}
