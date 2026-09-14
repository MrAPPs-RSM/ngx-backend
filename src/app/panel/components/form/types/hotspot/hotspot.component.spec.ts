import { TestBed, waitForAsync } from '@angular/core/testing';

import { HotspotComponent } from './hotspot.component';

describe('HotspotComponent', () => {
  let component: HotspotComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [HotspotComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(HotspotComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
