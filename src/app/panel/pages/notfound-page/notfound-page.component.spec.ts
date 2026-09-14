import { TestBed, waitForAsync } from '@angular/core/testing';

import { NotfoundPageComponent } from './notfound-page.component';

describe('NotfoundPageComponent', () => {
  let component: NotfoundPageComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [NotfoundPageComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(NotfoundPageComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
