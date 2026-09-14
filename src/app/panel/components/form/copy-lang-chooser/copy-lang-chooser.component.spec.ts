import { TestBed } from '@angular/core/testing';

import { CopyLangChooserComponent } from './copy-lang-chooser.component';

describe('CopyLangChooserComponent', () => {
  let component: CopyLangChooserComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [CopyLangChooserComponent] })
    .compileComponents();
  });

  beforeEach(() => {
    component = TestBed.inject(CopyLangChooserComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
