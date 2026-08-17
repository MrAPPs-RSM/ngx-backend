import {Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';

export interface UploaderOptions {
  concurrency?: number;
  maxUploads?: number;
  allowedContentTypes?: string[];
}

export interface UploadFile {
  id: string;
  name: string;
  nativeFile: File;
  progress?: {data?: {percentage?: number}};
  response?: any;
  responseStatus?: number;
}

export interface UploadInput {
  type: 'uploadAll' | 'cancel' | 'remove' | 'removeAll';
  url?: string;
  method?: string;
  id?: string;
  file?: UploadFile;
}

export interface UploadOutput {
  type: 'allAddedToQueue' | 'addedToQueue' | 'uploading' | 'removed' | 'removedAll' |
    'cancelled' | 'dragOver' | 'dragOut' | 'drop' | 'rejected' | 'done';
  file?: UploadFile;
}

@Directive({
  selector: 'input[ngFileSelect], [ngFileDrop]',
  standalone: true
})
export class ModernUploaderDirective implements OnInit, OnDestroy {
  @Input() options: UploaderOptions = {};
  @Input() uploadInput: EventEmitter<UploadInput>;
  @Output() uploadOutput = new EventEmitter<UploadOutput>();

  private files: UploadFile[] = [];
  private requests = new Map<string, XMLHttpRequest>();
  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.uploadInput?.subscribe(input => this.handleInput(input));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.requests.forEach(request => request.abort());
  }

  @HostListener('change', ['$event'])
  onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.addFiles(input.files);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.uploadOutput.emit({type: 'dragOver'});
  }

  @HostListener('dragleave', ['$event'])
  onDragOut(event: DragEvent): void {
    event.preventDefault();
    this.uploadOutput.emit({type: 'dragOut'});
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.uploadOutput.emit({type: 'drop'});
    this.addFiles(event.dataTransfer?.files || null);
  }

  private addFiles(list: FileList | null): void {
    if (!list) {
      return;
    }

    Array.from(list).forEach(nativeFile => {
      const allowed = !this.options.allowedContentTypes?.length ||
        this.options.allowedContentTypes.includes(nativeFile.type);
      if (!allowed || (this.options.maxUploads && this.files.length >= this.options.maxUploads)) {
        this.uploadOutput.emit({type: 'rejected'});
        return;
      }

      const file: UploadFile = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: nativeFile.name,
        nativeFile,
        progress: {data: {percentage: 0}}
      };
      this.files.push(file);
      this.uploadOutput.emit({type: 'addedToQueue', file});
    });
    this.uploadOutput.emit({type: 'allAddedToQueue'});
  }

  private handleInput(input: UploadInput): void {
    switch (input.type) {
      case 'uploadAll':
        this.files.forEach(file => this.upload(file, input));
        break;
      case 'cancel':
        if (input.id) {
          this.requests.get(input.id)?.abort();
          const file = this.files.find(item => item.id === input.id);
          this.uploadOutput.emit({type: 'cancelled', file});
        }
        break;
      case 'remove': {
        const file = input.file || this.files.find(item => item.id === input.id);
        this.files = this.files.filter(item => item !== file);
        this.uploadOutput.emit({type: 'removed', file});
        break;
      }
      case 'removeAll':
        this.files = [];
        this.uploadOutput.emit({type: 'removedAll'});
        break;
    }
  }

  private upload(file: UploadFile, input: UploadInput): void {
    if (!input.url) {
      return;
    }
    const request = new XMLHttpRequest();
    this.requests.set(file.id, request);
    request.open(input.method || 'POST', input.url);
    request.upload.onprogress = event => {
      if (event.lengthComputable) {
        file.progress = {data: {percentage: Math.round(event.loaded * 100 / event.total)}};
      }
      this.uploadOutput.emit({type: 'uploading', file});
    };
    request.onload = () => {
      file.responseStatus = request.status;
      try {
        file.response = JSON.parse(request.responseText);
      } catch {
        file.response = request.responseText;
      }
      this.requests.delete(file.id);
      this.uploadOutput.emit({type: 'done', file});
    };
    request.onerror = () => {
      file.responseStatus = request.status;
      file.response = {error: request.statusText || 'Upload failed'};
      this.requests.delete(file.id);
      this.uploadOutput.emit({type: 'done', file});
    };
    const data = new FormData();
    data.append('file', file.nativeFile, file.name);
    request.send(data);
  }
}
