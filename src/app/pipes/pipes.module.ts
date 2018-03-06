import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslatePipe} from './translate/translate.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        TranslatePipe
    ],
    declarations: [TranslatePipe]
})
export class PipesModule {
}
