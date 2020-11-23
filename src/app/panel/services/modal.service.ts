import {Injectable} from '@angular/core';
import {Modal} from 'ngx-modialog-7/plugins/bootstrap';
import {LanguageService} from './language.service';

@Injectable()
export class ModalService {

    constructor(private _modal: Modal, private _lang: LanguageService) {
    }

    public confirm(title?: string, body?: string, confirm?: string, dismiss?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const dialog = this._modal.confirm()
                .size('sm')
                .showClose(false)
                .title(title ? title : this._lang.translate('modals.confirm.title'))
                .body(body ? body : this._lang.translate('modals.confirm.body'))
                .okBtn(confirm ? confirm : this._lang.translate('modals.confirm.ok'))
                .okBtnClass('btn btn-sm btn-primary')
                .cancelBtn(dismiss ? dismiss : this._lang.translate('modals.confirm.cancel'))
                .cancelBtnClass('btn btn-sm btn-link')
                .open();

            dialog.result
                .then(() => resolve()) // Confirm
                .catch(() => reject()); // Dismiss
        });
    }

    public alert(title?: string, body?: string, bodyClass?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const dialog = this._modal.alert()
                .size('lg')
                .showClose(true)
                .title(title ? title : this._lang.translate('modals.alert.title'))
                .body(body ? body : '')
                .bodyClass(bodyClass)
                .open();

            dialog.result
                .then(() => resolve())
                .catch(() => resolve());
        });
    }
}
