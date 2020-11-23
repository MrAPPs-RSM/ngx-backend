import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HotspotComponent } from './hotspot.component';

describe('HotspotComponent', () => {
  let component: HotspotComponent;
  let fixture: ComponentFixture<HotspotComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HotspotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotspotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
