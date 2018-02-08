import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import {PanelModule} from './panel/panel.module';
import {ReactiveFormsModule} from '@angular/forms';


import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';

import {ApiService} from './api/api.service';
import {TokenService} from './auth/token.service';
import {LoginGuard} from './auth/login.guard';
import {UtilsService} from './services/utils.service';

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
        LoginComponent
    ],
    imports: [
        RouterModule.forRoot(routes),
        ReactiveFormsModule,
        BrowserModule,
        HttpClientModule,
        PanelModule
    ],
    providers: [
        ApiService,
        TokenService,
        LoginGuard,
        UtilsService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
