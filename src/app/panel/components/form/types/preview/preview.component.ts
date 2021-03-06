import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {ApiService, ErrorResponse} from '../../../../../api/api.service';
import {FormFieldPreview} from '../../interfaces/form-field-preview';
import {environment} from '../../../../../../environments/environment';
import {Subscription} from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PreviewComponent extends BaseInputComponent implements OnInit, OnDestroy {

  @Input() field: FormFieldPreview;

  constructor(private _apiService: ApiService) {
    super();
  }

  isVisible: boolean;

  min: number;
  max: number;
  offset = 1;

  url: string;
  private fileId: number;

  private _subscription: Subscription = Subscription.EMPTY;
  private _fileSubscription: Subscription = Subscription.EMPTY;

  ngOnInit() {
    this.reset();
    this.updateFormValue();

    this.isVisible = false;

    if (this.isEdit) {
      this._subscription = this.getControl().valueChanges.pipe(first()).subscribe((value) => {
        this.offset = value;
        this.onFileChange();
        this._subscription.unsubscribe();
      });
    }

    this.onFileChange();
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    if (this._fileSubscription) {
      this._fileSubscription.unsubscribe();
    }
  }

  onChange() {
    if (this.offset > 0) {
      this.getData();
    }
  }

  updateOffset(event: any) {
    this.offset = event.offset;
    this.onChange();
  }

  onImageError() {
    this.url = environment.assets.imageError;
  }

  private onFileChange() {
    this._fileSubscription = this.getControl(this.field.fileKey).valueChanges.subscribe((value) => {
      /** If file is uploaded */
      if (value) {
        if (value instanceof Array) {
          this.isVisible = value && value.length > 0;
          if (this.isVisible) {
            this.fileId = value[0].id;
          }
        } else {
          this.isVisible = !!value;
          this.fileId = value['id'];
        }
        this.getData();
      } else {
        this.offset = 1;
        this.isVisible = false;
      }
    });
  }

  private getData() {
    if (this.fileId) {
      this._apiService.get(this.field.endpoint + '/' + this.fileId, {offset: this.offset})
        .then((response: PreviewResponse) => {
          this.url = response.url;
          this.min = response.min;
          this.max = response.max;
          this.offset = response.offset;
          this.updateFormValue();
        })
        .catch((response: ErrorResponse) => {
          this.reset();
        });
    }
  }

  private updateFormValue() {
    this.getControl().setValue(this.offset);
  }

  private reset() {
    this.min = 0;
    this.max = 0;
    this.offset = 1;
  }
}

interface PreviewResponse {
    url: string;
    min: number;
    max: number;
    offset: number;
}
