import { Input, Output, EventEmitter, OnDestroy, Directive } from '@angular/core';
import {Subscription} from 'rxjs';

import {Column} from '../../../lib/data-set/column';
import {Grid} from '../../../lib/grid';

@Directive()
export class DefaultFilter implements Filter, OnDestroy {

    delay: number = 300;
    changesSubscription: Subscription;
    @Input() grid: Grid;
    @Input() query: any;
    @Input() inputClass: string;
    @Input() column: Column;
    @Output() filter = new EventEmitter<string>();

    ngOnDestroy() {
        if (this.changesSubscription) {
            this.changesSubscription.unsubscribe();
        }
    }

    setFilter() {
        if (this.column.filter.multiple && this.query.length === 0) {
            this.filter.emit('');
        } else {
            this.filter.emit(this.query);
        }
    }
}

export interface Filter {

    delay?: number;
    changesSubscription?: Subscription;
    query: string;
    inputClass: string;
    column: Column;
    filter: EventEmitter<string>;
}
