import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {FilterModule} from '../filter/filter.module';
import {CellModule} from '../cell/cell.module';

import {Ng2SmartTableTheadComponent} from './thead.component';
import {ActionsTitleComponent} from './cells/actions-title.component';
import {DragTitleComponent} from './cells/drag-title.component';
import {AddButtonComponent} from './cells/add-button.component';
import {CheckboxSelectAllComponent} from './cells/checkbox-select-all.component';
import {ColumnTitleComponent} from './cells/column-title.component';
import {TitleComponent} from './cells/title/title.component';
import {TheadFitlersRowComponent} from './rows/thead-filters-row.component';
import {TheadTitlesRowComponent} from './rows/thead-titles-row.component';
import {TooltipModule} from 'ngx-tooltip';

const THEAD_COMPONENTS = [
    ActionsTitleComponent,
    DragTitleComponent,
    AddButtonComponent,
    CheckboxSelectAllComponent,
    ColumnTitleComponent,
    TitleComponent,
    TheadFitlersRowComponent,
    TheadTitlesRowComponent,
    Ng2SmartTableTheadComponent,
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FilterModule,
        CellModule,
        TooltipModule

    ],
    declarations: [
        ...THEAD_COMPONENTS,
    ],
    exports: [
        ...THEAD_COMPONENTS,
    ],
})
export class THeadModule {
}
