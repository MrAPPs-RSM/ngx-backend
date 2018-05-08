import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

export abstract class DataSource {

    protected onChangedSource = new Subject<any>();
    protected onUpdatedSource = new Subject<any>();

    abstract getElements(): Promise<any>;

    abstract getSort(): any;

    abstract getFilter(): any;

    abstract getPaging(): any;

    abstract count(): number;

    refresh() {
        this.emitOnChanged('refresh');
    }

    load(data: Array<any>): Promise<any> {
        this.emitOnChanged('load');
        return Promise.resolve();
    }

    onChanged(): Observable<any> {
        return this.onChangedSource.asObservable();
    }

    onUpdated(): Observable<any> {
        return this.onUpdatedSource.asObservable();
    }

    update(element: any, values: any): Promise<any> {
        this.emitOnUpdated(element);
        this.emitOnChanged('update');
        return Promise.resolve();
    }

    empty(): Promise<any> {
        this.emitOnChanged('empty');
        return Promise.resolve();
    }

    addSort(conf: any, doEmit?: boolean) {
        if (doEmit) {
            this.emitOnChanged('sort');
        }
    }

    removeSort(key: string, doEmit?: boolean) {
        if (doEmit) {
            this.emitOnChanged('sort');
        }
    }

    setSort(conf: Array<any>, doEmit?: boolean) {
        if (doEmit) {
            this.emitOnChanged('sort');
        }
    }

    setFilter(conf: Array<any>, andOperator?: boolean, doEmit?: boolean) {
        if (doEmit) {
            this.emitOnChanged('filter');
        }
    }

    addFilter(fieldConf: {}, andOperator?: boolean, doEmit?: boolean) {
        if (doEmit) {
            this.emitOnChanged('filter');
        }
    }

    setPaging(page: number, perPage: number, doEmit?: boolean) {
        if (doEmit) {
            this.emitOnChanged('paging');
        }
    }

    setPage(page: number, doEmit?: boolean) {
        if (doEmit) {
            this.emitOnChanged('page');
        }
    }

    protected emitOnUpdated(element: any) {
        this.onUpdatedSource.next(element);
    }

    protected emitOnChanged(action: string) {
        this.getElements().then((elements) => this.onChangedSource.next({
            action: action,
            elements: elements,
            paging: this.getPaging(),
            filter: this.getFilter(),
            sort: this.getSort(),
        }));
    }
}
