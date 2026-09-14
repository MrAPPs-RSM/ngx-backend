import { TestBed, waitForAsync } from '@angular/core/testing';

import { ImageComponent } from './image.component';

describe('ImageComponent', () => {
  let component: ImageComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [ImageComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(ImageComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
