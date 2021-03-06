import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as url from 'url';

@Injectable()
export class UtilsService {

    constructor() {
    }

    public static uniqueArray(array: any[], key: string): any[] {
        const unique = {};
        const distinct = [];
        for (const i in array) {
            if (typeof (unique[array[i][key]]) === 'undefined') {
                distinct.push(array[i]);
            }
            unique[array[i][key]] = 0;
        }
        return distinct;
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
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this.mergeDeep(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
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
            format = 'DD/MM/YYYY, HH:mm:ss';
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

    public static parseParams(filters: any, data: any): any {
        // Parse other params
        for (let u in filters.where) {
            if (u === 'and' || u === 'or') {
                for (let c in filters.where[u]) {
                    if (Object.values(filters.where[u][c])[0][0] === ':' && Object.values(filters.where[u][c])[0] !== ':id') {
                        let key: string = (Object.values(filters[u][c])[0] as string).replace(':', '');
                        let filterKey: string = Object.keys(filters.where[u][c])[0];

                        filters.where[u][c][filterKey] = data[key];
                    }
                }
            } else {
                // Check if start with :
                // If yes =>
                // Substitute with value
                if (filters.where[u][0] === ':' && filters.where[u] !== ':id') {
                    let key: string = filters.where[u].replace(':', '');

                    filters.where[u] = data[key];
                }
            }
        }

        return filters;
    }

    public static parseEndpoint(endpoint: string, data: any): string {
        // Add / to last character
        // this is because we can have /endpoint/:param1/:param2
        // So rebuild /endpoint/:param1/:param2/ for last param easy parsing
        let end = endpoint;
        end += '/';

        for (let i = 0; i < end.length; i++) {
            // Check if we are on parameter
            if (end[i] === ':') {
                // Replace with value
                endpoint = endpoint.replace(end.substring(i, end.indexOf('/', i)), encodeURIComponent(data[end.substring(i, end.indexOf('/', i)).replace(':', '')]));
            }
        }

        return endpoint;
    }
}
