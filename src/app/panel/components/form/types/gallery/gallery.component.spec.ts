import { TestBed, waitForAsync } from '@angular/core/testing';

import { GalleryComponent } from './gallery.component';

describe('GalleryComponent', () => {
  let component: GalleryComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [GalleryComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(GalleryComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
