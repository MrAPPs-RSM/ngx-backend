import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-modialog';
import {BootstrapModalModule} from 'ngx-modialog/plugins/bootstrap';

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
        ModalModule.forRoot(),
        BootstrapModalModule
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
        TablePageComponent
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
