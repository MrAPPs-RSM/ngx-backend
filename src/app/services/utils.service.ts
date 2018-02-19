import {Injectable} from '@angular/core';

@Injectable()
export class UtilsService {

    constructor() {
    }

    public static sortByKey(array: any[], key: string): any[] {
        return array.sort((a, b) => {
            const x = a[key];
            const y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
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

    public static containsValue(obj: any, value: any): boolean {
        Object.keys(obj).forEach((key) => {
            if (obj[key] === value) {
                return true;
            }
        });
        return false;
    }

    public static removeObjectFromArray(obj: any, list: any[]): any[] {
        let index = -1;
        list.forEach((item, i) => {
            if (obj === item) {
                index = i;
            }
        });
        if (index !== -1) {
            list.splice(index, 1);
        }
        return list;
    }
}
