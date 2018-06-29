import {BrowserModule} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {Router, RouterModule, Routes} from '@angular/router';
import {PanelModule} from './panel/panel.module';
import {ReactiveFormsModule} from '@angular/forms';
import {ToastrModule, ToastNoAnimation, ToastNoAnimationModule} from 'ngx-toastr';
import {AppComponent} from './app.component';
import {LoginComponent} from './auth/login/login.component';
import {ModalModule} from 'ngx-modialog';
import {BootstrapModalModule} from 'ngx-modialog/plugins/bootstrap';

import {GlobalState} from './global.state';
import {ApiService} from './api/api.service';
import {LoginGuard} from './auth/guards/login.guard';
import {PasswordChangeGuard} from './auth/guards/password-change.guard';
import {PasswordResetGuard} from './auth/guards/password-reset.guard';
import {UtilsService} from './services/utils.service';
import {FormGeneratorService} from './panel/services/form-generator.service';
import {PageRefreshService} from './services/page-refresh.service';
import {UserService} from './auth/services/user.service';
import {PasswordResetComponent} from './auth/password-reset/password-reset.component';
import {PasswordChangeComponent} from './auth/password-change/password-change.component';
import {ToastsService} from './services/toasts.service';
import {PendingChangesGuard} from './auth/guards/pending-changes.guard';
import {environment} from '../environments/environment';

const routes: Routes = [
    {
        path: 'password-reset',
        canActivate: [
            PasswordResetGuard
        ],
        component: PasswordResetComponent
    },
    {
        path: 'password-change',
        canActivate: [
            PasswordChangeGuard
        ],
        component: PasswordChangeComponent
    },
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
    }
];

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        PasswordResetComponent,
        PasswordChangeComponent
    ],
    imports: [
        RouterModule.forRoot(routes, {useHash: false, onSameUrlNavigation: 'reload'}),
        ReactiveFormsModule,
        BrowserModule,
        NoopAnimationsModule,
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
        PasswordChangeGuard,
        PendingChangesGuard,
        PasswordResetGuard,
        UtilsService,
        FormGeneratorService,
        PageRefreshService,
        ToastsService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor(private _router: Router) {
        if (environment.domains) {
            this.addDomains();
        }
    }

    private addDomains(): void {

        const routerConfig = this._router.config;

        const newConfiguration = [];

        newConfiguration.push({
            path: ':domain',
            children: routerConfig,
            pathMatch: 'prefix'
        });

        this._router.resetConfig(newConfiguration);
    }
}
