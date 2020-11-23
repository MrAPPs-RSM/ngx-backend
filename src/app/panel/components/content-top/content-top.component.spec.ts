import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentTopComponent } from './content-top.component';

describe('ContentTopComponent', () => {
  let component: ContentTopComponent;
  let fixture: ComponentFixture<ContentTopComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
