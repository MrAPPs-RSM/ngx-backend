import { TestBed } from '@angular/core/testing';

import { ErrorAlertComponent } from './error-alert.component';

describe('ErrorAlertComponent', () => {
  let component: ErrorAlertComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [ErrorAlertComponent] })
    .compileComponents();
  });

  beforeEach(() => {
    component = TestBed.inject(ErrorAlertComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
