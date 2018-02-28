import {Injectable} from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class UtilsService {

    constructor() {
    }

    private static addLeadingZero(value: any): any {
        return value < 10 ? '0' + value : value;
    }

    public static timeConverter(timestamp: number) {
        const a = new Date(timestamp);
        const year = a.getUTCFullYear();
        let month = a.getUTCMonth() + 1;
        let date = a.getUTCDate();
        let hour = a.getUTCHours();
        let min = a.getUTCMinutes();
        let sec = a.getUTCSeconds();

        month = UtilsService.addLeadingZero(month);
        date = UtilsService.addLeadingZero(date);
        hour = UtilsService.addLeadingZero(hour);
        min = UtilsService.addLeadingZero(min);
        sec = UtilsService.addLeadingZero(sec);

        return year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
    }

    public static isValidURL(str) {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
    }

    public static sortByKey(array: any[], key: string): any[] {
        return array.sort((a, b) => {
            const x = a[key];
            const y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    public static containsObject(obj: any, list: any[]): number {
        let i;
        for (i = 0; i < list.length; i++) {
            if (_.isEqual(list[i], obj)) {
                return i;
            }
        }
        return -1;
    }

    public static isEmptyObject(obj: any): boolean {
        return Object.keys(obj).length === 0;
    }

    public static containsValue(obj: any, value: any): boolean {
        Object.keys(obj).forEach((key) => {
            if (_.isEqual(obj[key], value)) {
                return true;
            }
        });
        return false;
    }

    public static removeObjectFromArray(obj: any, list: any[]): any[] {
        let index = -1;
        list.forEach((item, i) => {
            if (_.isEqual(obj, item)) {
                index = i;
            }
        });
        if (index !== -1) {
            list.splice(index, 1);
        }
        return list;
    }
}
