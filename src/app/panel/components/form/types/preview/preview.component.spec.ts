import { TestBed, waitForAsync } from '@angular/core/testing';

import { PreviewComponent } from './preview.component';

describe('PreviewComponent', () => {
  let component: PreviewComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [PreviewComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(PreviewComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
