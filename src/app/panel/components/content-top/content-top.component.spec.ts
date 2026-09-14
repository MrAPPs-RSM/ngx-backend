import { TestBed, waitForAsync } from '@angular/core/testing';

import { ContentTopComponent } from './content-top.component';

describe('ContentTopComponent', () => {
  let component: ContentTopComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [ContentTopComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(ContentTopComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
