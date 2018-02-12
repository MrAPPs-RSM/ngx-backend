import { TestBed, inject } from '@angular/core/testing';

import { PageTitleService } from './page-title.service';

describe('PageTitleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageTitleService]
    });
  });

  it('should be created', inject([PageTitleService], (service: PageTitleService) => {
    expect(service).toBeTruthy();
  }));
});
