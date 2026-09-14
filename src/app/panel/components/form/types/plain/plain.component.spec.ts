import { TestBed, waitForAsync } from '@angular/core/testing';

import { PlainComponent } from './plain.component';

describe('PlainComponent', () => {
  let component: PlainComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [PlainComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(PlainComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
