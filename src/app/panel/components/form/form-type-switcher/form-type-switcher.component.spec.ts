import { TestBed, waitForAsync } from '@angular/core/testing';

import { FormTypeSwitcherComponent } from './form-type-switcher.component';

describe('FormTypeSwitcherComponent', () => {
  let component: FormTypeSwitcherComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [FormTypeSwitcherComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(FormTypeSwitcherComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
