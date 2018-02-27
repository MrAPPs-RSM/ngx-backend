import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {FilterComponent} from './filter.component';
import {CheckboxFilterComponent} from './filter-types/checkbox-filter.component';
import {InputFilterComponent} from './filter-types/input-filter.component';
import {SelectFilterComponent} from './filter-types/select-filter.component';
import {NgSelectModule} from '@ng-select/ng-select';

const FILTER_COMPONENTS = [
    FilterComponent,
    CheckboxFilterComponent,
    InputFilterComponent,
    SelectFilterComponent,
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
    ],
    declarations: [
        ...FILTER_COMPONENTS,
    ],
    exports: [
        ...FILTER_COMPONENTS,
    ],
})
export class FilterModule {
}
