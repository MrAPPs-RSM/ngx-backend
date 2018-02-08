import { TestBed, inject } from '@angular/core/testing';

import { FormGeneratorService } from './form-generator.service';

describe('FormGeneratorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormGeneratorService]
    });
  });

  it('should be created', inject([FormGeneratorService], (service: FormGeneratorService) => {
    expect(service).toBeTruthy();
  }));
});
