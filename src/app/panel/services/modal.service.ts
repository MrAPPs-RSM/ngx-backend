import {Injectable} from '@angular/core';
import {Modal} from 'ngx-modialog/plugins/bootstrap';

@Injectable()
export class ModalService {

    constructor(private _modal: Modal) {
    }

    public confirm(title?: string, body?: string, confirm?: string, dismiss?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const dialog = this._modal.confirm()
                .size('sm')
                .showClose(false)
                .title(title ? title : 'Confirm action')
                .body(body ? body : 'Are you sure?')
                .okBtn(confirm ? confirm : 'Confirm')
                .okBtnClass('btn btn-sm btn-primary')
                .cancelBtn(dismiss ? dismiss : 'Dismiss')
                .cancelBtnClass('btn btn-sm btn-link')
                .open();

            dialog.result
                .then(() => resolve()) // Confirm
                .catch(() => reject()); // Dismiss
        });
    }

    public alert(title?: string, body?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const dialog = this._modal.alert()
                .size('lg')
                .showClose(true)
                .title(title ? title : 'Alert')
                .body(body ? body : '')
                .open();

            dialog.result
                .then(() => resolve());
        });
    }
}
