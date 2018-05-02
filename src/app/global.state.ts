import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class GlobalState {

    public _activePageSubject: Subject<any>;
    public replaceLastPath: boolean;

    constructor() {
        this._activePageSubject = new Subject<any>();
        this.replaceLastPath = false;
    }
}
