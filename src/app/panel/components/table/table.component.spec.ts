import { TestBed, waitForAsync } from '@angular/core/testing';

import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [TableComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(TableComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not retain filters removed from query params', () => {
    component.settings = {
      api: {
        endpoint: 'items',
        filter: { where: { level: 1 } }
      }
    } as any;
    (component as any).filter = {
      where: {
        level: 1,
        code: '02'
      }
    };

    const filter = (component as any).prepareFilter({ where: { level: 1 } });

    expect(filter.where).toEqual({ level: 1 });
    expect(filter.where.code).toBeUndefined();
  });
});
