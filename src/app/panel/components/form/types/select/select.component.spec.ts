import { TestBed, waitForAsync } from '@angular/core/testing';

import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [SelectComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(SelectComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
