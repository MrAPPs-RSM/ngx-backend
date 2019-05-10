import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {UploaderOptions, UploadFile, UploadInput, UploadOutput} from 'ngx-uploader';
import {environment} from '../../../../environments/environment';
import {UserService} from '../../../auth/services/user.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileUploaderComponent implements OnInit, OnChanges {

  private static url: string;
  public options: UploaderOptions;

  public files: UploadFile[];
  public uploadInput: EventEmitter<UploadInput>;

  public isLoading = false;
  public dragOver: boolean;

  @Input() removeFiles: boolean;

  @Output() response: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

  constructor(private userService: UserService) {
    this.options = {concurrency: 1, maxUploads: 1};
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    FileUploaderComponent.url = environment.api.baseUrl + 'uploads?access_token=' + this.userService.getToken();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['removeFiles']) {
      if (changes['removeFiles'].currentValue) {
        this.removeAllFiles();
      }
    }
  }

  public onUploadOutput(output: UploadOutput): void {

    console.log(output);

    if (output.type === 'allAddedToQueue') {
      this.startUpload();
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.isLoading = true;
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'done') {
      this.isLoading = false;
      this.handleResponse(output.file.response, output.file.responseStatus);
    } else if (output.type === 'cancelled' || output.type === 'removed') {
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'removedAll') {
      this.files = [];
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      console.log(output.file.name + ' rejected');
    }

    console.log(this.files);
  }

  private startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: FileUploaderComponent.url,
      method: 'POST'
    };

    this.uploadInput.emit(event);
  }

  private handleResponse(response: any, statusCode: number): void {
    console.log('[HANDLE RESPONSE]');
    console.log(response);
    if (response) {
      this.response.emit(response);
    }
  }

  public cancelUpload(id: string): void {
    this.uploadInput.emit({type: 'cancel', id: id});
    this.cancel.emit(id);
  }

  private removeFile(id: string): void {
    this.uploadInput.emit({type: 'remove', id: id});
  }

  private removeAllFiles(): void {
    this.uploadInput.emit({type: 'removeAll'});
  }
}
