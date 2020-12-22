import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotspotCanvasComponent } from './hotspot-canvas.component';

describe('HotspotCanvasComponent', () => {
  let component: HotspotCanvasComponent;
  let fixture: ComponentFixture<HotspotCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotspotCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotspotCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
