import { TestBed } from '@angular/core/testing';

import { HotspotCanvasComponent } from './hotspot-canvas.component';

describe('HotspotCanvasComponent', () => {
  let component: HotspotCanvasComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [HotspotCanvasComponent] })
    .compileComponents();
  });

  beforeEach(() => {
    component = TestBed.inject(HotspotCanvasComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
