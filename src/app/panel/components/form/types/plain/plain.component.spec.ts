import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlainComponent } from './plain.component';

describe('PlainComponent', () => {
  let component: PlainComponent;
  let fixture: ComponentFixture<PlainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
