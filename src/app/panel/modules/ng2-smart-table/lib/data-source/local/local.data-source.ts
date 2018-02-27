import {DataSource} from '../data-source';
import {deepExtend} from '../../helpers';

export class LocalDataSource extends DataSource {

    protected data: Array<any> = [];
    protected _count: number;
    protected sortConf: Array<any> = [];
    protected filterConf: any = {
        filters: [],
        andOperator: true,
    };
    protected pagingConf: any = {};

    constructor(data: Array<any> = []) {
        super();

        this.data = data;
    }

    load(data: Array<any>): Promise<any> {
        this.data = data;
        return super.load(data);
    }

    update(element: any, values: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.find(element).then((found) => {
                found = deepExtend(found, values);
                super.update(found, values).then(resolve).catch(reject);
            }).catch(reject);
        });
    }

    find(element: any): Promise<any> {
        const found = this.data.find(el => el === element);
        if (found) {
            return Promise.resolve(found);
        }

        return Promise.reject(new Error('Element was not found in the dataset'));
    }

    getElements(): Promise<any> {
        return Promise.resolve(this.data);
    }

    empty(): Promise<any> {
        this.data = [];

        return super.empty();
    }

    count(): number {
        return this._count;
    }

    setCount(count: number): void {
        this._count = count;
    }

    /**
     *
     * Array of conf objects
     * [
     *  {field: string, direction: asc|desc|null, compare: Function|null},
     * ]
     * @param conf
     * @param doEmit
     * @returns {LocalDataSource}
     */
    setSort(conf: Array<any>, doEmit = true): LocalDataSource {
        if (conf !== null) {

            conf.forEach((fieldConf) => {
                if (!fieldConf['field'] || typeof fieldConf['direction'] === 'undefined') {
                    throw new Error('Sort configuration object is not valid');
                }
            });
            this.sortConf = conf;
        }

        super.setSort(conf, doEmit);
        return this;
    }

    /**
     *
     * Array of conf objects
     * [
     *  {field: string, search: string, filter: Function|null},
     * ]
     * @param conf
     * @param andOperator
     * @param doEmit
     * @returns {LocalDataSource}
     */
    setFilter(conf: Array<any>, andOperator = true, doEmit = true): LocalDataSource {
        if (conf && conf.length > 0) {
            conf.forEach((fieldConf) => {
                this.addFilter(fieldConf, andOperator, false);
            });
        } else {
            this.filterConf = {
                filters: [],
                andOperator: true,
            };
        }
        this.filterConf.andOperator = andOperator;
        this.pagingConf['page'] = 1;

        super.setFilter(conf, andOperator, doEmit);
        return this;
    }

    addFilter(fieldConf: any, andOperator = true, doEmit: boolean = true): LocalDataSource {
        if (!fieldConf['field'] || typeof fieldConf['search'] === 'undefined') {
            throw new Error('Filter configuration object is not valid');
        }

        let found = false;
        this.filterConf.filters.forEach((currentFieldConf: any, index: any) => {
            if (currentFieldConf['field'] === fieldConf['field']) {
                this.filterConf.filters[index] = fieldConf;
                found = true;
            }
        });
        if (!found) {
            this.filterConf.filters.push(fieldConf);
        }
        this.filterConf.andOperator = andOperator;
        super.addFilter(fieldConf, andOperator, doEmit);
        return this;
    }

    setPaging(page: number, perPage: number, doEmit: boolean = true): LocalDataSource {
        this.pagingConf['page'] = page;
        this.pagingConf['perPage'] = perPage;

        super.setPaging(page, perPage, doEmit);
        return this;
    }

    setPage(page: number, doEmit: boolean = true): LocalDataSource {
        this.pagingConf['page'] = page;
        super.setPage(page, doEmit);
        return this;
    }

    getSort(): any {
        return this.sortConf;
    }

    getFilter(): any {
        return this.filterConf;
    }

    getPaging(): any {
        return this.pagingConf;
    }
}
