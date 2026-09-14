import { TestBed, waitForAsync } from '@angular/core/testing';

import { InputUrlComponent } from './input-url.component';

describe('InputUrlComponent', () => {
  let component: InputUrlComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [InputUrlComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(InputUrlComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
