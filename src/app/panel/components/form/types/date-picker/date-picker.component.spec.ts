import { TestBed, waitForAsync } from '@angular/core/testing';

import { DatePickerComponent } from './date-picker.component';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [DatePickerComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(DatePickerComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
