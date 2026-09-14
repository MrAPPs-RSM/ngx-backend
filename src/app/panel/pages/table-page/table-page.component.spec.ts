import { TestBed, waitForAsync } from '@angular/core/testing';

import { TablePageComponent } from './table-page.component';

describe('TablePageComponent', () => {
  let component: TablePageComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [TablePageComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(TablePageComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
