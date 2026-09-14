import { TestBed, waitForAsync } from '@angular/core/testing';

import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [CheckboxComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(CheckboxComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
