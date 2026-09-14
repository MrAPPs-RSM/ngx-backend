import { TestBed, waitForAsync } from '@angular/core/testing';

import { InputColorComponent } from './input-color.component';

describe('InputColorComponent', () => {
  let component: InputColorComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [InputColorComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(InputColorComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
