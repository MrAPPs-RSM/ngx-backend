import { TestBed, waitForAsync } from '@angular/core/testing';

import { DomainNotFoundComponent } from './domain-not-found.component';

describe('LoginComponent', () => {
  let component: DomainNotFoundComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [DomainNotFoundComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(DomainNotFoundComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
