import { TestBed, waitForAsync } from '@angular/core/testing';

import { InputNumberComponent } from './input-number.component';

describe('InputNumberComponent', () => {
  let component: InputNumberComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [InputNumberComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(InputNumberComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
