import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {ColorPickerModule} from 'ngx-color-picker';
import {EditorModule} from '@tinymce/tinymce-angular';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgUploaderModule} from 'ngx-uploader';
import {AgmCoreModule} from '@agm/core';
import {Ng2SmartTableModule} from './modules/ng2-smart-table/ng2-smart-table.module';
import {PipesModule} from '../pipes/pipes.module';
import {NouisliderModule} from 'ng2-nouislider';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {CKEditorModule} from 'ng2-ckeditor';
import {TextMaskModule} from 'angular2-text-mask';

import {PanelComponent} from './panel.component';
import {FormPageComponent} from './pages/form-page/form-page.component';
import {TablePageComponent} from './pages/table-page/table-page.component';
import {ProfilePageComponent} from './pages/profile-page/profile-page.component';
import {NotfoundPageComponent} from './pages/notfound-page/notfound-page.component';

import {AuthGuard} from '../auth/guards/auth.guard';
import {SetupService} from './services/setup.service';
import {PanelResolver} from './resolvers/panel.resolver';
import {ModalService} from './services/modal.service';
import {LanguageService} from './services/language.service';
import {MenuService} from './services/menu.service';
import {TranslatePipe} from '../pipes/translate/translate.pipe';


import {TableComponent} from './components/table/table.component';
import {DashboardPageComponent} from './pages/dashboard-page/dashboard-page.component';
import {PageTitleService} from './services/page-title.service';
import {FormComponent} from './components/form/form.component';
import {BaseInputComponent} from './components/form/types/base-input/base-input.component';
import {InputPasswordComponent} from './components/form/types/input-password/input-password.component';
import {InputTextComponent} from './components/form/types/input-text/input-text.component';
import {InputUrlComponent} from './components/form/types/input-url/input-url.component';
import {InputNumberComponent} from './components/form/types/input-number/input-number.component';
import {SeparatorComponent} from './components/form/types/separator/separator.component';
import {InputColorComponent} from './components/form/types/input-color/input-color.component';
import {InputTextareaComponent} from './components/form/types/input-textarea/input-textarea.component';
import {SelectComponent} from './components/form/types/select/select.component';
import {InputEmailComponent} from './components/form/types/input-email/input-email.component';
import {CheckboxComponent} from './components/form/types/checkbox/checkbox.component';
import {FileUploadComponent} from './components/form/types/file-upload/file-upload.component';
import {MapComponent} from './components/form/types/map/map.component';
import {ContentTopComponent} from './components/content-top/content-top.component';
import {FormTypeSwitcherComponent} from './components/form/form-type-switcher/form-type-switcher.component';
import {ListDetailsComponent} from './components/form/types/list-details/list-details.component';
import {PlainComponent} from './components/form/types/plain/plain.component';
import {PreviewComponent} from './components/form/types/preview/preview.component';
import {DatePickerComponent} from './components/form/types/date-picker/date-picker.component';
import {DateRangePickerComponent} from './components/form/types/date-range-picker/date-range-picker.component';
import {MediaLibraryComponent} from './components/form/types/media-library/media-library.component';
import {TimetablePickerComponent} from './components/form/types/timetable-picker/timetable-picker.component';
import {GeoSearchComponent} from './components/form/types/geo-search/geo-search.component';
import { GalleryComponent } from './components/form/types/gallery/gallery.component';
import { Select2Component } from './components/form/types/select-2/select-2.component';
import { CloudinaryLibraryComponent } from './components/form/types/cloudinary-library/cloudinary-library.component';
import { HotspotComponent } from './components/form/types/hotspot/hotspot.component';
import {environment} from "../../environments/environment";

const COMPONENTS = [
    PanelComponent,
    FormComponent,
    TableComponent,
    DashboardPageComponent,
    BaseInputComponent,
    InputTextComponent,
    InputPasswordComponent,
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
    HotspotComponent
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

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        FormsModule,
        ColorPickerModule,
        EditorModule,
        NgSelectModule,
        NgUploaderModule,
        AgmCoreModule.forRoot({
            apiKey: environment.googleMapsApiKey ? environment.googleMapsApiKey : ''
        }),
        Ng2SmartTableModule,
        PipesModule,
        NouisliderModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        CKEditorModule,
        TextMaskModule
    ],
    exports: [
        FormComponent,
        InputTextComponent,
        InputPasswordComponent
    ],
    declarations: [
        ...COMPONENTS
    ],
    providers: [
        ...PROVIDERS
    ],
    entryComponents: [
        FormPageComponent,
        TablePageComponent,
        DashboardPageComponent,
        ProfilePageComponent,
        NotfoundPageComponent
    ]
})
export class PanelModule {

}
