import {Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {map, mergeMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-data-paginator',
  templateUrl: './data-paginator.component.html',
  styleUrls: ['./data-paginator.component.scss']
})
export class DataPaginatorComponent implements OnInit {

  @Input() service: any;
  @Input() functionName: string;
  @Input() objectToCreate: any;
  @Input() hoverEffect: boolean;

  @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();

  page = 1;
  isLoading = false;
  isFinished = false;
  offset = new BehaviorSubject(null);
  infinite: Observable<any[]>;
  data: Array<any> = [];

  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  @ContentChild('header') headerTemplate: TemplateRef<any>;
  @ContentChild('item') itemTemplate: TemplateRef<any>;
  @ContentChild('noData') noDataTemplate: TemplateRef<any>;

  constructor() {
  }

  ngOnInit() {
    this.loadData();
  }

  public reset(): void {
    this.data = [];
  }

  public loadData(): void {
    this.infinite = this.offset.pipe(
      mergeMap(n => {
        return this.getBatch(this.page);
      })
    );
  }

  trackItem(index: number, item: any): number {
    return item.id;
  }

  getBatch(page: number) {
    this.isLoading = true;
    return from(this.service[this.functionName](5, page))
      .pipe(
        tap((res) => {
          if ('total_pages' in res) {
            if (res['total_pages'] === this.page) {
              console.log('finished');
              this.isFinished = true;
            } else {
              this.page++;
            }
          } else {
            this.isFinished = true;
          }

          this.isLoading = false;
        }),
        map(res => {
          const resData: Array<any> = this.data.slice(0);

          (res as Array<any>).forEach((itemData) => {
            resData.push(new this.objectToCreate(itemData));
          });

          this.data = resData;
          return resData;
        })
      );
  }

  nextBatch(e: any): void {
    if (this.isFinished) {
      return;
    }

    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    console.log(`${end}, '>=', ${total}`);
    if (end === total) {
      console.log('NEXT BATCH');
      this.offset.next(this.page);
    }
  }

  handleClick($event: any, item: any): void {
    this.rowClick.emit(item);
  }
}

