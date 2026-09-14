import {Injectable} from '@angular/core';
import {LanguageService} from './language.service';

@Injectable()
export class ModalService {

    constructor(private _lang: LanguageService) {
    }

    public confirm(title?: string, body?: string, confirm?: string, dismiss?: string): Promise<void> {
        const message = this.toPlainText([
            title || this._lang.translate('modals.confirm.title'),
            body || this._lang.translate('modals.confirm.body')
        ].filter(Boolean).join('\n\n'));

        return window.confirm(message) ? Promise.resolve() : Promise.reject();
    }

    public alert(title?: string, body?: string, bodyClass?: string): Promise<void> {
        window.alert(this.toPlainText([
            title || this._lang.translate('modals.alert.title'),
            body || ''
        ].filter(Boolean).join('\n\n')));
        return Promise.resolve();
    }

    private toPlainText(value: string): string {
        const element = document.createElement('div');
        element.innerHTML = value;
        return element.textContent || element.innerText || '';
    }
}
