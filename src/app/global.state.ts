import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class GlobalState {

    public _activePageSubject: Subject<any>;

    constructor() {
        this._activePageSubject = new Subject<any>();
    }
}
