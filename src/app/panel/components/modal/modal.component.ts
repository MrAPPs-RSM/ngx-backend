import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {ModalService} from '../../services/modal.service';
import {ModalData} from '../../../interfaces/modal-data';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements OnDestroy {

  private _subscription: Subscription;

  data: ModalData;

  constructor(modalService: ModalService, cdr: ChangeDetectorRef) {
    this._subscription = modalService.dataChange.subscribe((updatedData) => {
        this.data = updatedData;
        cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

}
