import { TestBed, inject } from '@angular/core/testing';

import { RegionsService } from './regions.service';

describe('RegionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegionsService]
    });
  });

  it('should be created', inject([RegionsService], (service: RegionsService) => {
    expect(service).toBeTruthy();
  }));
});
