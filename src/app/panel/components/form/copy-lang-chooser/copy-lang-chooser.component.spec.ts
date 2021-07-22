import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyLangChooserComponent } from './copy-lang-chooser.component';

describe('CopyLangChooserComponent', () => {
  let component: CopyLangChooserComponent;
  let fixture: ComponentFixture<CopyLangChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyLangChooserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyLangChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
