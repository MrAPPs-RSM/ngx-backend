import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { Router, RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';

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
import {httpInterceptorProviders} from './interceptors';
import { ToastNotificationComponent } from './services/toast-notification/toast-notification.component';
import { LanguageService } from './panel/services/language.service';
import { MenuService } from './panel/services/menu.service';
import { PageTitleService } from './panel/services/page-title.service';
import { DynamicFormModule } from './panel/components/form/dynamic-form.module';
import { ModalService } from './panel/services/modal.service';

registerLocaleData(localeIt);

const routes: Routes = [
    {
        path: 'panel',
        loadChildren: () => import('./panel/panel.module').then(module => module.PanelModule)
    },
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

@NgModule({ declarations: [
        AppComponent,
        LoginComponent,
        PasswordResetComponent,
        PasswordChangeComponent,
        DomainNotFoundComponent,
        ToastNotificationComponent
    ],
    bootstrap: [AppComponent], imports: [RouterModule.forRoot(routes, { useHash: false, onSameUrlNavigation: 'reload' }),
        ReactiveFormsModule,
        BrowserModule,
        NoopAnimationsModule,
        MatSnackBarModule,
        DynamicFormModule,
        OwlNativeDateTimeModule], providers: [
        { provide: LOCALE_ID, useValue: 'it-IT' },
        {
            provide: APP_INITIALIZER,
            useFactory: (PageRefreshService: PageRefreshService) => () => PageRefreshService.setBreadcrumb(),
            deps: [PageRefreshService],
            multi: true
        },
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
        StorageService,
        LanguageService,
        MenuService,
        ModalService,
        PageTitleService,
        httpInterceptorProviders,
        provideHttpClient(withXhr(), withInterceptorsFromDi())
    ] })
  
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
