import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule, Routes } from '@angular/router';
import { PanelModule } from './panel/panel.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastNoAnimation, ToastNoAnimationModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { ModalModule } from 'ngx-modialog-7';
import { BootstrapModalModule } from 'ngx-modialog-7/plugins/bootstrap';

import { GlobalState } from './global.state';
import { ApiService } from './api/api.service';
import { LoginGuard } from './auth/guards/login.guard';
import { PasswordChangeGuard } from './auth/guards/password-change.guard';
import { PasswordResetGuard } from './auth/guards/password-reset.guard';
import { UtilsService } from './services/utils.service';
import { FormGeneratorService } from './panel/services/form-generator.service';
import { PageRefreshService } from './services/page-refresh.service';
import { UserService } from './auth/services/user.service';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { PasswordChangeComponent } from './auth/password-change/password-change.component';
import { ToastsService } from './services/toasts.service';
import { PendingChangesGuard } from './auth/guards/pending-changes.guard';
import { environment } from '../environments/environment';
import { StorageService } from './services/storage.service';
import { DomainNotFoundComponent } from './auth/domain-not-found/domain-not-found.component';

registerLocaleData(localeIt);

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
    }
];

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        PasswordResetComponent,
        PasswordChangeComponent,
        DomainNotFoundComponent
    ],
    imports: [
        RouterModule.forRoot(routes, { useHash: false, onSameUrlNavigation: 'reload', relativeLinkResolution: 'legacy' }),
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
        { provide: LOCALE_ID, useValue: 'it-IT'},
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
        ToastsService,
        StorageService
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        DomainNotFoundComponent
    ]
})
export class AppModule {

    constructor(private _router: Router) {
        this.configRoutes(environment.domains);
    }

    private configRoutes(domains?: boolean): void {

        const routerConfig = this._router.config;

        let newConfiguration = [];

        routerConfig.push({
            path: '',
            redirectTo: 'login',
            pathMatch: 'full'
        });


        if (domains) {
            newConfiguration.push({
                path: ':domain',
                children: routerConfig,
                pathMatch: 'prefix'
            },
                {
                    path: '**',
                    component: DomainNotFoundComponent
                }
            );
        } else {
            newConfiguration = routerConfig;
        }

        this._router.resetConfig(newConfiguration);
    }
}
