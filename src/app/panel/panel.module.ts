import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUploaderModule } from 'ngx-uploader';
import { AgmCoreModule } from '@agm/core';
import { Ng2SmartTableModule } from './modules/ng2-smart-table/ng2-smart-table.module';
import { PipesModule } from '../pipes/pipes.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { NgxMaskModule, IConfig } from 'ngx-mask'

import { PanelComponent } from './panel.component';
import { FormPageComponent } from './pages/form-page/form-page.component';
import { TablePageComponent } from './pages/table-page/table-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { NotfoundPageComponent } from './pages/notfound-page/notfound-page.component';

import { AuthGuard } from '../auth/guards/auth.guard';
import { SetupService } from './services/setup.service';
import { PanelResolver } from './resolvers/panel.resolver';
import { ModalService } from './services/modal.service';
import { LanguageService } from './services/language.service';
import { MenuService } from './services/menu.service';
import { TranslatePipe } from '../pipes/translate/translate.pipe';


import { TableComponent } from './components/table/table.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { PageTitleService } from './services/page-title.service';
import { FormComponent } from './components/form/form.component';
import { BaseInputComponent } from './components/form/types/base-input/base-input.component';
import { InputPasswordComponent } from './components/form/types/input-password/input-password.component';
import { InputTextComponent } from './components/form/types/input-text/input-text.component';
import { InputUrlComponent } from './components/form/types/input-url/input-url.component';
import { InputNumberComponent } from './components/form/types/input-number/input-number.component';
import { SeparatorComponent } from './components/form/types/separator/separator.component';
import { InputColorComponent } from './components/form/types/input-color/input-color.component';
import { InputTextareaComponent } from './components/form/types/input-textarea/input-textarea.component';
import { SelectComponent } from './components/form/types/select/select.component';
import { InputEmailComponent } from './components/form/types/input-email/input-email.component';
import { CheckboxComponent } from './components/form/types/checkbox/checkbox.component';
import { FileUploadComponent } from './components/form/types/file-upload/file-upload.component';
import { MapComponent } from './components/form/types/map/map.component';
import { ContentTopComponent } from './components/content-top/content-top.component';
import { FormTypeSwitcherComponent } from './components/form/form-type-switcher/form-type-switcher.component';
import { ListDetailsComponent } from './components/form/types/list-details/list-details.component';
import { PlainComponent } from './components/form/types/plain/plain.component';
import { PreviewComponent } from './components/form/types/preview/preview.component';
import { DatePickerComponent } from './components/form/types/date-picker/date-picker.component';
import { DateRangePickerComponent } from './components/form/types/date-range-picker/date-range-picker.component';
import { MediaLibraryComponent } from './components/form/types/media-library/media-library.component';
import { TimetablePickerComponent } from './components/form/types/timetable-picker/timetable-picker.component';
import { GeoSearchComponent } from './components/form/types/geo-search/geo-search.component';
import { GalleryComponent } from './components/form/types/gallery/gallery.component';
import { ImageComponent } from './components/form/types/image/image.component';
import { Select2Component } from './components/form/types/select-2/select-2.component';
import { CloudinaryLibraryComponent } from './components/form/types/cloudinary-library/cloudinary-library.component';
import { HotspotComponent } from './components/form/types/hotspot/hotspot.component';
import { environment } from '../../environments/environment';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TicketDetailPageComponent } from './pages/ticket-detail-page/ticket-detail-page.component';
import { FileUploaderComponent } from './pages/ticket-detail-page/components/file-uploader/file-uploader.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSliderModule} from '@angular/material/slider';
import { HotspotCanvasComponent } from './components/form/types/hotspot-canvas/hotspot-canvas.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import { CKEditorModule } from 'ckeditor4-angular';
import * as moment from 'moment';

import {BootstrapModalModule} from 'ngx-modialog-7/plugins/bootstrap';
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';
import { ErrorAlertComponent } from './components/error-alert/error-alert.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { BaseLongPollingComponent } from './components/base-long-polling/base-long-polling.component';
import { CopyLangChooserComponent } from './components/form/copy-lang-chooser/copy-lang-chooser.component';

export function momentAdapterFactory() {
  return adapterFactory(moment);
};

const COMPONENTS = [
  PanelComponent,
  FormComponent,
  TableComponent,
  DashboardPageComponent,
  BaseInputComponent,
  InputTextComponent,
  InputPasswordComponent,
  TicketDetailPageComponent,
  FormPageComponent,
  TablePageComponent,
  InputUrlComponent,
  InputNumberComponent,
  SeparatorComponent,
  FormTypeSwitcherComponent,
  InputColorComponent,
  InputTextareaComponent,
  SelectComponent,
  InputEmailComponent,
  CheckboxComponent,
  FileUploadComponent,
  ListDetailsComponent,
  MapComponent,
  ContentTopComponent,
  FileUploaderComponent,
  ProfilePageComponent,
  NotfoundPageComponent,
  PlainComponent,
  PreviewComponent,
  DatePickerComponent,
  DateRangePickerComponent,
  MediaLibraryComponent,
  TimetablePickerComponent,
  GeoSearchComponent,
  GalleryComponent,
  Select2Component,
  CloudinaryLibraryComponent,
  HotspotComponent,
  ImageComponent
];

const PROVIDERS = [
  AuthGuard,
  SetupService,
  MenuService,
  PanelResolver,
  PageTitleService,
  ModalService,
  LanguageService,
  TranslatePipe
];


const routes: Routes = [
  {
    path: 'panel',
    canActivate: [
      AuthGuard
    ],
    resolve: {
      params: PanelResolver
    },
    children: [
      {
        path: '**',
        canActivate: [
          AuthGuard
        ],
        resolve: {
          params: PanelResolver
        },
        component: PanelComponent,
        pathMatch: 'full'
      }
    ],
    component: PanelComponent,
    pathMatch: 'prefix'
  }
];

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    ColorPickerModule,
    ScrollingModule,
    NgSelectModule,
    MatSliderModule,
    MatInputModule,
    MatFormFieldModule,
    NgxUploaderModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsApiKey ? environment.googleMapsApiKey : ''
    }),
    Ng2SmartTableModule,
    PipesModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxMaskModule.forRoot(),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
    CKEditorModule
  ],
  exports: [
    FormComponent,
    InputTextComponent,
    InputPasswordComponent
  ],
  declarations: [
    ...COMPONENTS,
    HotspotCanvasComponent,
    CalendarPageComponent,
    ErrorAlertComponent,
    LanguageSelectorComponent,
    BaseLongPollingComponent,
    CopyLangChooserComponent
  ],
  providers: [
    ...PROVIDERS
  ],
  entryComponents: [
    FormPageComponent,
    TablePageComponent,
    DashboardPageComponent,
    TicketDetailPageComponent,
    ProfilePageComponent,
    NotfoundPageComponent
  ]
})
export class PanelModule {

}
