import { TestBed, waitForAsync } from '@angular/core/testing';

import { TicketDetailPageComponent } from './ticket-detail-page.component';

describe('TicketDetailPageComponent', () => {
  let component: TicketDetailPageComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [TicketDetailPageComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(TicketDetailPageComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
