import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';
import {LanguageService} from '../panel/services/language.service';
import {
    ToastNotificationComponent,
    ToastNotificationData
} from './toast-notification/toast-notification.component';

export interface ToastOptions {
    timeOut?: number;
    duration?: number;
}

@Injectable()
export class ToastsService {

    private readonly TYPES = {
        success: 'success',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };

    private _activeRef?: MatSnackBarRef<ToastNotificationComponent>;
    private _activeSignature?: string;

    constructor(private _snackBar: MatSnackBar, private _lang: LanguageService) {
    }

    public success(title?: string, message?: string, options?: ToastOptions): void {
        this._show(this.TYPES.success, title, message, options);
    }

    public warning(title?: string, message?: string, options?: ToastOptions): void {
        this._show(this.TYPES.warning, title, message, options);
    }

    public info(title?: string, message?: string, options?: ToastOptions): void {
        this._show(this.TYPES.info, title, message, options);
    }

    public error(error?: { name?: string, message?: string }, title?: string, message?: string,
                 options?: ToastOptions): void {
        this._show(this.TYPES.error, title, message, options, error);
    }

    private _show(type: string, title?: string, message?: string, options?: ToastOptions,
                  error?: { name?: string, message?: string }): void {
        const data: ToastNotificationData = {
            title: this._extractTitle(type, title),
            message: this._extractMessage(type, message, error)
        };
        const signature = `${type}:${data.title}:${data.message}`;

        if (this._activeRef && this._activeSignature === signature) {
            return;
        }

        const snackBarRef = this._snackBar.openFromComponent(ToastNotificationComponent, {
            data,
            duration: options?.timeOut ?? options?.duration ?? 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['toast-snack-bar', `toast-snack-bar-${type}`],
            announcementMessage: data.title ? `${data.title}. ${data.message}` : data.message
        });

        this._activeRef = snackBarRef;
        this._activeSignature = signature;
        snackBarRef.afterDismissed().subscribe(() => {
            if (this._activeRef === snackBarRef) {
                this._activeRef = undefined;
                this._activeSignature = undefined;
            }
        });
    }

    private _extractTitle(type: string, title?: string): string {
        if (title) {
            return title.toUpperCase();
        }

        return type === this.TYPES.error
            ? ''
            : this._lang.translate('toasts.' + type + '.title').toUpperCase();
    }

    private _extractMessage(type: string, message?: string, error?: { message?: string }): string {
        let _message;

        if (error) {
            _message = error.message;
        } else {
            _message = message;
        }

        if (!_message) {
            _message = this._lang.translate('toasts.' + type + '.message');
        }

        return _message.charAt(0).toUpperCase() + _message.slice(1);
    }

}
