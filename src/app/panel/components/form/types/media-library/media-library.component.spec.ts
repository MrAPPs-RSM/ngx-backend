import { TestBed, waitForAsync } from '@angular/core/testing';

import { MediaLibraryComponent } from './media-library.component';

describe('MediaLibraryComponent', () => {
  let component: MediaLibraryComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [MediaLibraryComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(MediaLibraryComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
