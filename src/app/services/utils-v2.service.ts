import { Injectable } from "@angular/core";
import { Params } from "@angular/router";
import { UtilsService } from "./utils.service";

@Injectable()
export class UtilsV2Service {
    constructor() { }

    public static composeFilters(filter: any, params: Params): any {
        const merged = UtilsService.mergeDeep(filter, params);

        const keys = Object.keys(merged);
        keys.forEach((key) => {
            if (['skip', 'limit', 'order'].includes(key)) {
                return;
            }

            const filterKey = this.extractKey(key);
            if (filterKey) {
                merged[filterKey] = merged[key];
                delete merged[key];
            }
        });

        return merged;
    }

    public static getEndpoint(endpoint: string, filter: any): any {
        if (!('listParams' in filter)) {
            return endpoint;
        }

        const parsed = JSON.parse(filter['listParams']);
        for (const key of Object.keys(parsed)) {
            endpoint = endpoint.replace(
                ':' + key,
                parsed[key]
            );
        }

        return endpoint;
    }

    public static objectByString(filter: any, queryKey: string): any {
        if (!('listParams' in filter)) {
            return null;
        }

        const parsed = JSON.parse(filter['listParams']);
        const key = queryKey.indexOf('where.') >= 0 ? queryKey.replace(/where./g, '') : queryKey;
        return parsed[key] ?? null;
    }

    public static concatOnRefresh(filter: any, params: any): any {
        if (!('listParams' in filter)) {
            return params;
        }

        return Object.assign(params, {
            listParams: filter['listParams']
        });
    }

    public static transformEmptyToNull(formData: any): any {
        if (typeof formData !== 'object' || formData === null) {
            return formData === '' ? null : formData;
        }

        if (formData instanceof Date) {
            return formData.toISOString();
        }

        if (Array.isArray(formData)) {
            return formData.map((item) => this.transformEmptyToNull(item));
        }

        return Object.keys(formData).reduce((acc, key) => {
            acc[key] = this.transformEmptyToNull(formData[key]);
            return acc;
        }, {} as Record<string, any>);
    }

    private static extractKey(input: string): string | null {
        const match = input.match(/filter\[(\w+)]/);
        return match ? match[1] : null;
    }

    private static isDateValid(dateStr: any) {
        if (this.isNumeric(dateStr)) {
            return false;
        }

        return !isNaN(new Date(dateStr) as any);
    }

    private static isNumeric(num: any) {
        return !isNaN(num);
    }
}