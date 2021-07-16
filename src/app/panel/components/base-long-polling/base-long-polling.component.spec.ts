import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLongPollingComponent } from './base-long-polling.component';

describe('BaseLongPollingComponent', () => {
  let component: BaseLongPollingComponent;
  let fixture: ComponentFixture<BaseLongPollingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseLongPollingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLongPollingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
