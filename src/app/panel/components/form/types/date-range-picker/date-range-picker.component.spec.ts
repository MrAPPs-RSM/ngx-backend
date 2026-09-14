import { TestBed, waitForAsync } from '@angular/core/testing';

import { DateRangePickerComponent } from './date-range-picker.component';

describe('DateRangePickerComponent', () => {
  let component: DateRangePickerComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [DateRangePickerComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(DateRangePickerComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
