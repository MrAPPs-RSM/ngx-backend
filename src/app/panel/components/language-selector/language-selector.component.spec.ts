import { TestBed } from '@angular/core/testing';

import { LanguageSelectorComponent } from './language-selector.component';

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [LanguageSelectorComponent] })
    .compileComponents();
  });

  beforeEach(() => {
    component = TestBed.inject(LanguageSelectorComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
