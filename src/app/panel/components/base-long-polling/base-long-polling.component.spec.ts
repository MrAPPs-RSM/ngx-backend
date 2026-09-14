import { TestBed } from '@angular/core/testing';

import { BaseLongPollingComponent } from './base-long-polling.component';

describe('BaseLongPollingComponent', () => {
  let component: BaseLongPollingComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [BaseLongPollingComponent] })
    .compileComponents();
  });

  beforeEach(() => {
    component = TestBed.inject(BaseLongPollingComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
