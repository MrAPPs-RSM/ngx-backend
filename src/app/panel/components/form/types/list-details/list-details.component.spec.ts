import { TestBed, waitForAsync } from '@angular/core/testing';

import { ListDetailsComponent } from './list-details.component';

describe('ListDetailsComponent', () => {
  let component: ListDetailsComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [ListDetailsComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(ListDetailsComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
