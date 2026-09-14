import { TestBed, waitForAsync } from '@angular/core/testing';

import { MapComponent } from './map.component';

describe('MapComponent', () => {
  let component: MapComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [MapComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(MapComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
