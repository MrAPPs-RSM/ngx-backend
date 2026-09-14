import {Component, ChangeDetectionStrategy} from '@angular/core';

@Component({
    selector: '[ng2-st-drag-title]',
    template: `
        <div class="ng2-smart-title"><i class="fa fa-arrows"></i></div>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DragTitleComponent {

    constructor() {
    }
}
