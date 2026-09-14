import { TestBed, waitForAsync } from '@angular/core/testing';

import { PanelComponent } from './panel.component';

describe('PanelComponent', () => {
  let component: PanelComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [PanelComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(PanelComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
