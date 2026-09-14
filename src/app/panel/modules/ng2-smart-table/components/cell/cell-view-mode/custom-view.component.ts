import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';

import { Cell } from '../../../lib/data-set/cell';
import { ViewCell } from './view-cell';

@Component({
    selector: 'custom-view-component',
    template: `
    <ng-template #dynamicTarget></ng-template>
  `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CustomViewComponent implements AfterViewInit, OnDestroy {

  customComponent: any;
  @Input() cell: Cell;
  @ViewChild('dynamicTarget', { read: ViewContainerRef }) dynamicTarget: any;

  ngAfterViewInit() {
    if (this.cell && !this.customComponent) {
      this.createCustomComponent();
      this.callOnComponentInit();
      this.patchInstance();
    }
  }

  ngOnDestroy() {
    if (this.customComponent) {
      this.customComponent.destroy();
    }
  }

  protected createCustomComponent() {
    this.customComponent = this.dynamicTarget.createComponent(this.cell.getColumn().renderComponent);
  }

  protected callOnComponentInit() {
    const onComponentInitFunction = this.cell.getColumn().getOnComponentInitFunction();
    onComponentInitFunction && onComponentInitFunction(this.customComponent.instance);
  }

  protected patchInstance() {
    Object.assign(this.customComponent.instance, this.getPatch());
  }

  protected getPatch(): ViewCell {
    return {
      value: this.cell.getValue(),
      rowData: this.cell.getRow().getData()
    };
  }
}
