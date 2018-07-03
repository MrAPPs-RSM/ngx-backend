import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {

    constructor() {
    }

    getValue(key: string) {
        return localStorage.getItem(key);
    }

    clearValue(key: string): void {
        localStorage.removeItem(key);
    }

    setValue(key: string, value: any) {
        localStorage.setItem(key, value);
    }
}
