import { TestBed, waitForAsync } from '@angular/core/testing';

import { ProfilePageComponent } from './profile-page.component';

describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [ProfilePageComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(ProfilePageComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
