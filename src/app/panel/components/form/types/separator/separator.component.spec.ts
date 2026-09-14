import { TestBed, waitForAsync } from '@angular/core/testing';

import { SeparatorComponent } from './separator.component';

describe('SeparatorComponent', () => {
  let component: SeparatorComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [SeparatorComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(SeparatorComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
