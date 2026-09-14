import { TestBed } from '@angular/core/testing';

import { CalendarPageComponent } from './calendar-page.component';

describe('CalendarPageComponent', () => {
  let component: CalendarPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [CalendarPageComponent] })
    .compileComponents();
  });

  beforeEach(() => {
    component = TestBed.inject(CalendarPageComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
