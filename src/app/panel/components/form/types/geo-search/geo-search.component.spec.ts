import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {GeoSearchComponent} from './geo-search.component';

describe('GeoSearchComponent', () => {
  let component: GeoSearchComponent;
  let fixture: ComponentFixture<GeoSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
