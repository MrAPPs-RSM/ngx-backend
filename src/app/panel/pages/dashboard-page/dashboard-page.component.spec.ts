import { TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardPageComponent } from './dashboard-page.component';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [DashboardPageComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(DashboardPageComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
