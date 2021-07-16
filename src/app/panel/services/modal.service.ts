import {Injectable} from '@angular/core';
import {LanguageService} from './language.service';
import {Subject} from 'rxjs';
import {ModalData} from '../../interfaces/modal-data';

@Injectable()
export class ModalService {

    dataChange: Subject<ModalData> = new Subject<ModalData>();

    constructor(private _lang: LanguageService) {
    }

    public confirm(title?: string, body?: string, confirm?: string, dismiss?: string): void {
      this.dataChange.next({
        title: title ?? this._lang.translate('modals.confirm.title'),
        body: body ?? this._lang.translate('modals.confirm.body'),
        okButton: confirm ?? this._lang.translate('modals.confirm.ok'),
        okButtonClass: 'btn btn-sm btn-primary',
        cancelButton: dismiss ?? this._lang.translate('modals.confirm.cancel'),
        cancelButtonClass: 'btn btn-sm btn-link'
      });
    }

    public alert(title?: string, body?: string, bodyClass?: string): void {
      this.dataChange.next({
        title: title ?? this._lang.translate('modals.alert.title'),
        body: body ?? '',
        bodyClass
      });
    }
}
