import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatSliderModule } from '@angular/material/slider';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { OwlDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { NgSelectModule } from '@ng-select/ng-select';
import { ColorPickerDirective } from 'ngx-color-picker';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { PipesModule } from '../../../pipes/pipes.module';
import { ModernUploaderDirective } from '../../directives/modern-uploader.directive';
import { SortableDirective } from '../../directives/sortable.directive';
import { ErrorAlertComponent } from '../error-alert/error-alert.component';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { CopyLangChooserComponent } from './copy-lang-chooser/copy-lang-chooser.component';
import { FormTypeSwitcherComponent } from './form-type-switcher/form-type-switcher.component';
import { FormComponent } from './form.component';
import { BaseInputComponent } from './types/base-input/base-input.component';
import { CheckboxComponent } from './types/checkbox/checkbox.component';
import { CloudinaryLibraryComponent } from './types/cloudinary-library/cloudinary-library.component';
import { DatePickerComponent } from './types/date-picker/date-picker.component';
import { DateRangePickerComponent } from './types/date-range-picker/date-range-picker.component';
import { FileUploadComponent } from './types/file-upload/file-upload.component';
import { GalleryComponent } from './types/gallery/gallery.component';
import { GeoSearchComponent } from './types/geo-search/geo-search.component';
import { HotspotCanvasComponent } from './types/hotspot-canvas/hotspot-canvas.component';
import { HotspotComponent } from './types/hotspot/hotspot.component';
import { ImageComponent } from './types/image/image.component';
import { InputColorComponent } from './types/input-color/input-color.component';
import { InputEmailComponent } from './types/input-email/input-email.component';
import { InputNumberComponent } from './types/input-number/input-number.component';
import { InputPasswordComponent } from './types/input-password/input-password.component';
import { InputTextComponent } from './types/input-text/input-text.component';
import { InputTextareaComponent } from './types/input-textarea/input-textarea.component';
import { InputUrlComponent } from './types/input-url/input-url.component';
import { ListDetailsComponent } from './types/list-details/list-details.component';
import { MapComponent } from './types/map/map.component';
import { MediaLibraryComponent } from './types/media-library/media-library.component';
import { PlainComponent } from './types/plain/plain.component';
import { PreviewComponent } from './types/preview/preview.component';
import { Select2Component } from './types/select-2/select-2.component';
import { SelectComponent } from './types/select/select.component';
import { SeparatorComponent } from './types/separator/separator.component';
import { TimetablePickerComponent } from './types/timetable-picker/timetable-picker.component';

const COMPONENTS = [
  FormComponent,
  FormTypeSwitcherComponent,
  BaseInputComponent,
  InputTextComponent,
  InputPasswordComponent,
  InputUrlComponent,
  InputNumberComponent,
  SeparatorComponent,
  InputColorComponent,
  InputTextareaComponent,
  SelectComponent,
  Select2Component,
  InputEmailComponent,
  CheckboxComponent,
  FileUploadComponent,
  ListDetailsComponent,
  MapComponent,
  PlainComponent,
  PreviewComponent,
  DatePickerComponent,
  DateRangePickerComponent,
  MediaLibraryComponent,
  TimetablePickerComponent,
  GeoSearchComponent,
  GalleryComponent,
  CloudinaryLibraryComponent,
  HotspotComponent,
  HotspotCanvasComponent,
  ImageComponent,
  ErrorAlertComponent,
  LanguageSelectorComponent,
  CopyLangChooserComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerDirective,
    NgSelectModule,
    GoogleMapsModule,
    MatSliderModule,
    OwlDateTimeModule,
    NgxMaskDirective,
    ModernUploaderDirective,
    SortableDirective,
    CKEditorModule,
    PipesModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [provideNgxMask()]
})
export class DynamicFormModule {}
