import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTopComponent } from './content-top.component';

describe('ContentTopComponent', () => {
  let component: ContentTopComponent;
  let fixture: ComponentFixture<ContentTopComponent>;

  beforeEach(async(() => {
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
