import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {LanguageService} from '../panel/services/language.service';

@Injectable()
export class ToastsService {

    readonly TYPES = {
        success: 'success',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };

    constructor(private _toastr: ToastrService, private _lang: LanguageService) {
    }

    public success(title?: string, message?: string, options?: any) {
        this._toastr.success(
            this._extractMessage(this.TYPES.success, message),
            this._extractTitle(this.TYPES.success, title), options);
    }

    public warning(title?: string, message?: string, options?: any) {
        this._toastr.warning(
            this._extractMessage(this.TYPES.warning, message),
            this._extractTitle(this.TYPES.warning, title), options);
    }

    public info(title?: string, message?: string, options?: any) {
        this._toastr.info(
            this._extractMessage(this.TYPES.info, message),
            this._extractTitle(this.TYPES.info, title), options);
    }

    public error(error?: { name: string, message: string }, title?: string, message?: string, options?: any) {
        this._toastr.error(
            this._extractMessage(this.TYPES.error, message, error),
            this._extractTitle(this.TYPES.error, title, error), options);
    }

    private _extractTitle(type: string, title?: string, error?: { name: string }): string {
        let _title;

        if (error) {
            _title = error.name;
        } else {
            _title = title ? title : this._lang.translate('toasts.' + type + '.title');
        }

        return _title.toUpperCase();
    }

    private _extractMessage(type: string, message?: string, error?: { message: string }): string {
        let _message;

        if (error) {
            _message = error.message;
        } else {
            _message = message ? message : this._lang.translate('toasts.' + type + '.message');
        }

        return _message.charAt(0).toUpperCase() + _message.slice(1);
    }

}
