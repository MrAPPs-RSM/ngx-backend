import { TestBed, waitForAsync } from '@angular/core/testing';

import { PasswordChangeComponent } from './password-change.component';

describe('PasswordResetComponent', () => {
  let component: PasswordChangeComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [PasswordChangeComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(PasswordChangeComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
