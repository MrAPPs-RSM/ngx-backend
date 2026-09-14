import { TestBed, waitForAsync } from '@angular/core/testing';

import { BaseInputComponent } from './base-input.component';

describe('BaseInputComponent', () => {
  let component: BaseInputComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [BaseInputComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(BaseInputComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
