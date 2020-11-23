import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TicketDetailPageComponent } from './ticket-detail-page.component';

describe('TicketDetailPageComponent', () => {
  let component: TicketDetailPageComponent;
  let fixture: ComponentFixture<TicketDetailPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
