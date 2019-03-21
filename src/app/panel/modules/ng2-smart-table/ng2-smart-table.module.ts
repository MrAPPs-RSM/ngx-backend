import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DragulaModule} from 'ng2-dragula';

import {CellModule} from './components/cell/cell.module';
import {FilterModule} from './components/filter/filter.module';
import {PagerModule} from './components/pager/pager.module';
import {TBodyModule} from './components/tbody/tbody.module';
import {THeadModule} from './components/thead/thead.module';
import {GeneralActionsModule} from './components/general-actions/general-actions.module';

import {Ng2SmartTableComponent} from './ng2-smart-table.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CellModule,
        FilterModule,
        PagerModule,
        TBodyModule,
        THeadModule,
        GeneralActionsModule,
        DragulaModule.forRoot()
    ],
    declarations: [
        Ng2SmartTableComponent,
    ],
    exports: [
        Ng2SmartTableComponent,
        DragulaModule
    ],
})
export class Ng2SmartTableModule {
}
