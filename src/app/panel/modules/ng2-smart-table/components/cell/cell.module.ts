import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CellComponent } from './cell.component';
import { CustomViewComponent } from './cell-view-mode/custom-view.component';
import { ViewCellComponent } from './cell-view-mode/view-cell.component';

const CELL_COMPONENTS = [
  CellComponent,
  CustomViewComponent,
  ViewCellComponent,
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
export class CellModule { }
