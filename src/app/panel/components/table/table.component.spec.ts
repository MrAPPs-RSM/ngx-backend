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

  it('should download files using the native browser API', () => {
    const createObjectUrl = spyOn(URL, 'createObjectURL').and.returnValue('blob:test-download');
    const revokeObjectUrl = spyOn(URL, 'revokeObjectURL');
    const click = spyOn(HTMLAnchorElement.prototype, 'click');

    (component as any).downloadFile('content', 'export.csv', 'text/csv');

    expect(createObjectUrl).toHaveBeenCalled();
    const blob = createObjectUrl.calls.mostRecent().args[0] as Blob;
    expect(blob.type).toBe('text/csv');
    expect(click).toHaveBeenCalled();

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(revokeObjectUrl).toHaveBeenCalledWith('blob:test-download');
        resolve();
      }, 0);
    });
  });
});
