import { TestBed, waitForAsync } from '@angular/core/testing';

import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [FormComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(FormComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
