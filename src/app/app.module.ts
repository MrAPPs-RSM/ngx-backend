import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import {PanelModule} from './panel/panel.module';
import {ReactiveFormsModule} from '@angular/forms';
import {ToastrModule, ToastNoAnimation, ToastNoAnimationModule} from 'ngx-toastr';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';

import {ApiService} from './api/api.service';
import {TokenService} from './auth/token.service';
import {LoginGuard} from './auth/login.guard';
import {UtilsService} from './services/utils.service';
import {FormGeneratorService} from './panel/services/form-generator.service';
import {FormComponent} from './panel/components/form/form.component';
import {InputTextComponent} from './panel/components/form/types/input-text/input-text.component';
import {InputPasswordComponent} from './panel/components/form/types/input-password/input-password.component';

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
        component: LoginComponent
    }
];

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        FormComponent,
        InputTextComponent,
        InputPasswordComponent
    ],
    imports: [
        RouterModule.forRoot(routes),
        ReactiveFormsModule,
        BrowserModule,
        ToastNoAnimationModule,
        ToastrModule.forRoot({
            maxOpened: 1,
            timeOut: 200000,
            closeButton: true,
            preventDuplicates: true,
            tapToDismiss: false,
            toastComponent: ToastNoAnimation,
        }),
        HttpClientModule,
        PanelModule,
    ],
    providers: [
        ApiService,
        TokenService,
        LoginGuard,
        UtilsService,
        FormGeneratorService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
