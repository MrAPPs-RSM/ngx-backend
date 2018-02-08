import {Injectable} from '@angular/core';

@Injectable()
export class UtilsService {

    constructor() {
    }

    public static containsObject(obj: any, list: any[]): boolean {
        let i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }
        return false;
    }

    public static isEmptyObject(obj: any): boolean {
        return Object.keys(obj).length === 0;
    }

    static containsValue(obj: any, value: any): boolean {
        Object.keys(obj).forEach((key) => {
            if (obj[key] === value) {
                return true;
            }
        });
        return false;
    }
}
