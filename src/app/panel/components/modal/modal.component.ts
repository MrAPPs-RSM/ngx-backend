import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  @Input() title: string;
  @Input() body?: string;
  @Input() bodyClass?: string;
  @Input() closeButton?: string;
  @Input() okButton?: string;
  @Input() okButtonClass?: string;
  @Input() cancelButton?: string;
  @Input() cancelButtonClass?: string;

}
