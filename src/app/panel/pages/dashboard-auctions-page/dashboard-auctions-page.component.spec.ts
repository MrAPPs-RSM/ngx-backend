import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAuctionsPageComponent } from './dashboard-auctions-page.component';

describe('DashboardAuctionsPageComponent', () => {
  let component: DashboardAuctionsPageComponent;
  let fixture: ComponentFixture<DashboardAuctionsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardAuctionsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAuctionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
