import {Injectable} from '@angular/core';
import {LanguageService} from './language.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from '../components/modal/modal.component';

@Injectable()
export class ModalService {

    constructor(private _modal: NgbModal, private _lang: LanguageService) {
    }

    public confirm(title?: string, body?: string, confirm?: string, dismiss?: string): Promise<any> {
      const modalRef = this._modal.open(ModalComponent, {
        size: 'sm',
      });

      const current = modalRef.componentInstance;

      current.title = title ?? this._lang.translate('modals.confirm.title');
      current.body = body ?? this._lang.translate('modals.confirm.body');
      current.okButton = confirm ?? this._lang.translate('modals.confirm.ok');
      current.okButtonClass = 'btn btn-sm btn-primary';
      current.cancelButton = dismiss ?? this._lang.translate('modals.confirm.cancel');
      current.cancelButtonClass = 'btn btn-sm btn-link';

      return modalRef.result;
    }

    public alert(title?: string, body?: string, bodyClass?: string): Promise<any> {
      console.log('QUI ALMENO CI PASSA');

      const modalRef = this._modal.open(ModalComponent, {
        size: 'lg',
      });

      const current = modalRef.componentInstance;

      current.title = title ?? this._lang.translate('modals.alert.title');
      current.body = body ?? '';
      current.bodyClass = bodyClass;
      current.cancelButton = null;

      return modalRef.result;
    }
}
