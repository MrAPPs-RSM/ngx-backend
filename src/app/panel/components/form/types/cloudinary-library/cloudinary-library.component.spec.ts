import { TestBed, waitForAsync } from '@angular/core/testing';

import { CloudinaryLibraryComponent } from './cloudinary-library.component';

describe('CloudinaryLibraryComponent', () => {
  let component: CloudinaryLibraryComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [CloudinaryLibraryComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(CloudinaryLibraryComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
