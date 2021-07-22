import { TestBed } from '@angular/core/testing';

import { CopyLangHelperService } from './copy-lang-helper.service';

describe('CopyLangHelperService', () => {
  let service: CopyLangHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CopyLangHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
