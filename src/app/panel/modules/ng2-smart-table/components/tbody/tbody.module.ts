import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {CellModule} from '../cell/cell.module';

import {Ng2SmartTableTbodyComponent} from './tbody.component';
import {ActionsComponent} from './actions/actions.component';
import { MatTooltipModule } from '@angular/material/tooltip';

const TBODY_COMPONENTS = [
    Ng2SmartTableTbodyComponent,
    ActionsComponent
];

@NgModule({
    imports: [
        MatTooltipModule,
        CommonModule,
        FormsModule,
        CellModule
    ],
    declarations: [
        ...TBODY_COMPONENTS,
    ],
    exports: [
        ...TBODY_COMPONENTS,
    ],
})
export class TBodyModule {
}
