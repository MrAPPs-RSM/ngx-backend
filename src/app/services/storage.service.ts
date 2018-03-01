import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {

    public data: any = {};

    constructor() {
    }

    getValue(key: string) {
        return this.data[key];
    }

    clearValue(key: string): void {
        this.data[key] = null;
    }

    setValue(key: string, value: any) {
        this.data[key] = value;
    }

}
