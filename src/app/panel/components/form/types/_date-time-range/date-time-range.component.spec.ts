import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimeRangeComponent } from './date-time-range.component';

describe('DateTimeRangeComponent', () => {
  let component: DateTimeRangeComponent;
  let fixture: ComponentFixture<DateTimeRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateTimeRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
