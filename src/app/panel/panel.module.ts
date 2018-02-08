import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';


import {AuthGuard} from '../auth/auth.guard';
import {PanelComponent} from './panel.component';
import {FormPageComponent} from './pages/form-page/form-page.component';
import {TablePageComponent} from './pages/table-page/table-page.component';
import {FormComponent} from './components/form/form.component';
import {TableComponent} from './components/table/table.component';
import {InputTextComponent} from './components/form/types/input-text/input-text.component';

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
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
    declarations: [PanelComponent, FormPageComponent, TablePageComponent, FormComponent, TableComponent, InputTextComponent],
    providers: [
        AuthGuard
    ]
})
export class PanelModule {

}
