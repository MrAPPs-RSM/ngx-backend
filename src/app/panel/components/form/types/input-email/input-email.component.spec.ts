import { TestBed, waitForAsync } from '@angular/core/testing';

import { InputEmailComponent } from './input-email.component';

describe('InputEmailComponent', () => {
  let component: InputEmailComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [InputEmailComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(InputEmailComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
