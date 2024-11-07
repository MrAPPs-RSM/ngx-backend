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
        if ('listParams' in filter) {
            const parsed = JSON.parse(filter['listParams']);
            for (const key of Object.keys(parsed)) {
                endpoint = endpoint.replace(
                    ':' + key,
                    parsed[key]
                );
            }
        }

        return endpoint;
    }

    private static extractKey(input: string): string | null {
        const match = input.match(/filter\[(\w+)]/);
        return match ? match[1] : null;
    }
}