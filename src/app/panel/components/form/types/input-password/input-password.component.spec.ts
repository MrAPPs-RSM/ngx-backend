import { TestBed, waitForAsync } from '@angular/core/testing';

import { InputPasswordComponent } from './input-password.component';

describe('InputPasswordComponent', () => {
  let component: InputPasswordComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [InputPasswordComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(InputPasswordComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
