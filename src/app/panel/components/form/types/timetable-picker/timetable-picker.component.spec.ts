import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimetablePickerComponent } from './timetable-picker.component';

describe('TimetablePickerComponent', () => {
  let component: TimetablePickerComponent;
  let fixture: ComponentFixture<TimetablePickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimetablePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetablePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
