import { TestBed, waitForAsync } from '@angular/core/testing';

import {GeoSearchComponent} from './geo-search.component';

describe('GeoSearchComponent', () => {
  let component: GeoSearchComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [GeoSearchComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(GeoSearchComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
