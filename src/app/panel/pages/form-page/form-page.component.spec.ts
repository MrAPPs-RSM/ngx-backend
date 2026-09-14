import { TestBed, waitForAsync } from '@angular/core/testing';

import { FormPageComponent } from './form-page.component';

describe('FormPageComponent', () => {
  let component: FormPageComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [FormPageComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(FormPageComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
