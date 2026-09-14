import { TestBed, waitForAsync } from '@angular/core/testing';

import { TimetablePickerComponent } from './timetable-picker.component';

describe('TimetablePickerComponent', () => {
  let component: TimetablePickerComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [TimetablePickerComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(TimetablePickerComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
