import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {ColorPickerModule} from 'ngx-color-picker';
import {EditorModule} from '@tinymce/tinymce-angular';
import {NgSelectModule} from '@ng-select/ng-select';
import {NguiDatetimePickerModule} from '@ngui/datetime-picker';
import {NgUploaderModule} from 'ngx-uploader';
import {AgmCoreModule} from '@agm/core';
import {Ng2SmartTableModule} from './modules/ng2-smart-table/ng2-smart-table.module';


import {AuthGuard} from '../auth/auth.guard';
import {PanelComponent} from './panel.component';
import {FormPageComponent} from './pages/form-page/form-page.component';
import {TablePageComponent} from './pages/table-page/table-page.component';
import {TableComponent} from './components/table/table.component';
import {PanelResolver} from './resolvers/panel.resolver';
import {SetupService} from './services/setup.service';
import {DashboardPageComponent} from './pages/dashboard-page/dashboard-page.component';
import {PageTitleService} from './services/page-title.service';
import {FormComponent} from './components/form/form.component';
import {InputPasswordComponent} from './components/form/types/input-password/input-password.component';
import {InputTextComponent} from './components/form/types/input-text/input-text.component';
import {ModalService} from './services/modal.service';
import {InputUrlComponent} from './components/form/types/input-url/input-url.component';
import {InputNumberComponent} from './components/form/types/input-number/input-number.component';
import {SeparatorComponent} from './components/form/types/separator/separator.component';
import {InputColorComponent} from './components/form/types/input-color/input-color.component';
import {InputTextareaComponent} from './components/form/types/input-textarea/input-textarea.component';
import {SelectComponent} from './components/form/types/select/select.component';
import {InputEmailComponent} from './components/form/types/input-email/input-email.component';
import {CheckboxComponent} from './components/form/types/checkbox/checkbox.component';
import {DateTimeComponent} from './components/form/types/date-time/date-time.component';
import {DateTimeRangeComponent} from './components/form/types/date-time-range/date-time-range.component';
import {FileUploadComponent} from './components/form/types/file-upload/file-upload.component';
import {MapComponent} from './components/form/types/map/map.component';
import {ContentTopComponent} from './components/content-top/content-top.component';
import {FormTypeSwitcherComponent} from './components/form/form-type-switcher/form-type-switcher.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'panel',
        pathMatch: 'full'
    },
    {
        path: 'panel',
        component: PanelComponent,
        canActivate: [
            AuthGuard
        ],
        resolve: {
            params: PanelResolver
        }
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        ColorPickerModule,
        EditorModule,
        NgSelectModule,
        NguiDatetimePickerModule,
        NgUploaderModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAP1chVIcUZSeLzRhRhXYbo20SBj7bryfM' // TODO: set gmaps api key
        }),
        Ng2SmartTableModule
    ],
    exports: [
        FormComponent,
        InputTextComponent,
        InputPasswordComponent,
    ],
    declarations: [
        PanelComponent,
        FormComponent,
        TableComponent,
        DashboardPageComponent,
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
        DateTimeComponent,
        DateTimeRangeComponent,
        FileUploadComponent,
        MapComponent,
        ContentTopComponent
    ],
    providers: [
        AuthGuard,
        SetupService,
        PanelResolver,
        PageTitleService,
        ModalService
    ],
    entryComponents: [
        FormPageComponent,
        TablePageComponent,
        DashboardPageComponent
    ]
})
export class PanelModule {

}
