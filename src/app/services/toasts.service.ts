import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {LanguageService} from '../panel/services/language.service';

@Injectable()
export class ToastsService {

    constructor(private _toastr: ToastrService, private _lang: LanguageService) {
    }

    public success(title?: string, message?: string, options?: any) {
        this._toastr.success(this._extractMessage(message), this._extractTitle(title), options);
    }

    public warning(title?: string, message?: string, options?: any) {
        this._toastr.warning(this._extractMessage(message), this._extractTitle(title), options);
    }

    public info(title?: string, message?: string, options?: any) {
        this._toastr.info(this._extractMessage(message), this._extractTitle(title), options);
    }

    public error(error?: { name: string, message: string }, title?: string, message?: string, options?: any) {
        this._toastr.error(this._extractMessage(message, error), this._extractTitle(title, error), options);
    }

    private _extractTitle(title?: string, error?: { name: string }): string {
        let _title;

        if (error) {
            _title = error.name;
        } else {
            _title = title ? title : this._lang.translate('toasts.error.title');
        }

        return _title.toUpperCase();
    }

    private _extractMessage(message?: string, error?: { message: string }): string {
        let _message;

        if (error) {
            _message = error.message;
        } else {
            _message = message ? message : this._lang.translate('toasts.error.message');
        }

        return _message.charAt(0).toUpperCase() + _message.slice(1);
    }

}
