import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {CellComponent} from './cell.component';
import {CustomViewComponent} from './cell-view-mode/custom-view.component';
import {ViewCellComponent} from './cell-view-mode/view-cell.component';
import {BooleanViewComponent} from './cell-view-mode/types/boolean-view.component';
import {EmailViewComponent} from './cell-view-mode/types/email-view.component';
import {UrlViewComponent} from './cell-view-mode/types/url-view.component';
import {ImageViewComponent} from './cell-view-mode/types/image-view.component';
import {ColorViewComponent} from './cell-view-mode/types/color-view.component';
import {DateViewComponent} from './cell-view-mode/types/date-view.component';

const CELL_COMPONENTS = [
    CellComponent,
    CustomViewComponent,
    ViewCellComponent,
    BooleanViewComponent,
    EmailViewComponent,
    UrlViewComponent,
    ImageViewComponent,
    ColorViewComponent,
    DateViewComponent
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        ...CELL_COMPONENTS,
    ],
    exports: [
        ...CELL_COMPONENTS,
    ],
})
export class CellModule {
}
