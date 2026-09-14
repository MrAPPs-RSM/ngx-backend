import { TestBed, waitForAsync } from '@angular/core/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [LoginComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(LoginComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
