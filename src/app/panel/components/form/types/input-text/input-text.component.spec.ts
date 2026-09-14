import { TestBed, waitForAsync } from '@angular/core/testing';

import { InputTextComponent } from './input-text.component';

describe('InputTextComponent', () => {
  let component: InputTextComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [InputTextComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(InputTextComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
