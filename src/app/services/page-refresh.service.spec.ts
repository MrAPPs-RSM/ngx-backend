import { TestBed, inject } from '@angular/core/testing';

import { PageRefreshService } from './page-refresh.service';

describe('PageRefreshService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageRefreshService]
    });
  });

  it('should be created', inject([PageRefreshService], (service: PageRefreshService) => {
    expect(service).toBeTruthy();
  }));
});
