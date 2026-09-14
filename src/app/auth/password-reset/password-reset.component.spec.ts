import { TestBed, waitForAsync } from '@angular/core/testing';

import { PasswordResetComponent } from './password-reset.component';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [PasswordResetComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(PasswordResetComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
