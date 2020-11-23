import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotfoundPageComponent } from './notfound-page.component';

describe('NotfoundPageComponent', () => {
  let component: NotfoundPageComponent;
  let fixture: ComponentFixture<NotfoundPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotfoundPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotfoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
