import { TestBed, waitForAsync } from '@angular/core/testing';

import { InputTextareaComponent } from './input-textarea.component';

describe('InputTextareaComponent', () => {
  let component: InputTextareaComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [InputTextareaComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(InputTextareaComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
