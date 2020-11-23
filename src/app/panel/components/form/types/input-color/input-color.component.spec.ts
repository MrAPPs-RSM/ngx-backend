import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InputColorComponent } from './input-color.component';

describe('InputColorComponent', () => {
  let component: InputColorComponent;
  let fixture: ComponentFixture<InputColorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InputColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
