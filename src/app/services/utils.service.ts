import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class UtilsService {

    constructor() {
    }

    public static getDateObjectFromString(date: string): Date | null {
        if (date === 'now') {
            return new Date();
        } else {
            const timestamp = Date.parse(date);
            if (!isNaN(timestamp)) {
                return new Date(timestamp);
            } else {
                return null;
            }
        }
    }

    public static isObject(item: any) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

    public static objectByString(o: Object, s: string) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        const a = s.split('.');
        for (let i = 0, n = a.length; i < n; ++i) {
            const k = a[i];
            if (o && typeof o === 'object' && k in o) {
                o = o[k];
            } else {
                return null;
            }
        }
        return o;
    }

    public static mergeDeep(target, source): any {
        const output = Object.assign({}, target);
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, {[key]: source[key]});
                    } else {
                        output[key] = this.mergeDeep(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, {[key]: source[key]});
                }
            });
        }
        return output;
    }

    public static getFileType(extension: string): string {
        let response = '';

        if (extension.indexOf('.') !== -1) {
            extension = extension.split('.')[1];
        }

        switch (extension) {
            case 'x-flv':
            case 'x-ms-wmv':
            case 'quicktime':
            case 'avi':
            case 'mp4': {
                response = 'video/' + extension;
            }
                break;
            case 'gif':
            case 'jpg':
            case 'jpeg':
            case 'png': {
                response = 'image/' + extension;
            }
                break;
            case 'json':
            case 'zip':
            case 'pdf': {
                response = 'application/' + extension;
            }
                break;
            case 'xml':
            case 'csv': {
                response = 'text/' + extension;
            }
                break;
            case 'txt': {
                response = 'text/plain';
            }
                break;
            default: {
                response = extension;
            }
                break;
        }
        return response;
    }

    public static timeConverter(timestamp: number, format?: string) {
        if (!format) {
            format = 'DD/MM/YYYY, HH:mm';
        }

        return moment(timestamp).format(format);
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
        let notContains = true;
        Object.keys(obj).forEach((key) => {
            if (_.isEqual(obj[key], value)) {
                notContains = notContains && false;
            } else {
                notContains = notContains && true;
            }
        });

        return !notContains;
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

    public static isValidJSON(string) {
        try {
            JSON.parse(string);
            return true;
        } catch (e) {
            return false;
        }
    }
}
