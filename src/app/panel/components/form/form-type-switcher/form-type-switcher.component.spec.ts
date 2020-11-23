import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormTypeSwitcherComponent } from './form-type-switcher.component';

describe('FormTypeSwitcherComponent', () => {
  let component: FormTypeSwitcherComponent;
  let fixture: ComponentFixture<FormTypeSwitcherComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTypeSwitcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTypeSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
