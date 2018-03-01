import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GeneralActionsComponent} from './general-actions.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        GeneralActionsComponent,
    ],
    exports: [
        GeneralActionsComponent,
    ],
})
export class GeneralActionsModule {
}
