import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import {PanelModule} from './panel/panel.module';
import {ReactiveFormsModule} from '@angular/forms';
import {ToastrModule, ToastNoAnimation, ToastNoAnimationModule} from 'ngx-toastr';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {ModalModule} from 'ngx-modialog';
import {BootstrapModalModule} from 'ngx-modialog/plugins/bootstrap';

import {GlobalState} from './global.state';
import {ApiService} from './api/api.service';
import {LoginGuard} from './auth/login.guard';
import {UtilsService} from './services/utils.service';
import {FormGeneratorService} from './panel/services/form-generator.service';
import {PageRefreshService} from './services/page-refresh.service';
import {StorageService} from './services/storage.service';
import {UserService} from './auth/user.service';

const routes: Routes = [
    {
        path: 'login',
        canActivate: [
            LoginGuard
        ],
        component: LoginComponent
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent
    ],
    imports: [
        RouterModule.forRoot(routes, {useHash: true}),
        ReactiveFormsModule,
        BrowserModule,
        ToastNoAnimationModule,
        ToastrModule.forRoot({
            maxOpened: 1,
            timeOut: 3000,
            closeButton: true,
            preventDuplicates: true,
            tapToDismiss: true,
            toastComponent: ToastNoAnimation,
        }),
        HttpClientModule,
        PanelModule,
        ModalModule.forRoot(),
        BootstrapModalModule
    ],
    providers: [
        GlobalState,
        ApiService,
        UserService,
        LoginGuard,
        UtilsService,
        FormGeneratorService,
        PageRefreshService,
        StorageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
