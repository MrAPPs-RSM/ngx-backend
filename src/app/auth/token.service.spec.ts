import { TestBed, inject } from '@angular/core/testing';

import { TokenService } from './token.service';

describe('AuthTokenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenService]
    });
  });

  it('should be created', inject([TokenService], (service: TokenService) => {
    expect(service).toBeTruthy();
  }));
});
