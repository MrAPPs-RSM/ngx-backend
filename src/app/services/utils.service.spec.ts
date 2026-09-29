import { TestBed, inject } from '@angular/core/testing';

import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilsService]
    });
  });

  it('should be created', inject([UtilsService], (service: UtilsService) => {
    expect(service).toBeTruthy();
  }));

  it('should compare nested values without importing the full lodash bundle', () => {
    const values = [{id: 1, metadata: {enabled: true}}];

    expect(UtilsService.containsObject({id: 1, metadata: {enabled: true}}, values)).toBe(0);
    expect(UtilsService.containsObject({id: 1, metadata: {enabled: false}}, values)).toBe(-1);
  });

  it('should remove a deeply equal object from an array', () => {
    const values = [{id: 1}, {id: 2, tags: ['a', 'b']}];

    UtilsService.removeObjectFromArray({id: 2, tags: ['a', 'b']}, values);

    expect(values).toEqual([{id: 1}]);
  });
});
