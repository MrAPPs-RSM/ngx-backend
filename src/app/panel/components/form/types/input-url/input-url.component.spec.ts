import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InputUrlComponent } from './input-url.component';

describe('InputUrlComponent', () => {
  let component: InputUrlComponent;
  let fixture: ComponentFixture<InputUrlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InputUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
