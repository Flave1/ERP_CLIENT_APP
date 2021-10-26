import { TestBed, inject } from '@angular/core/testing';

import { TreasuryService } from './services/treasury.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TreasuryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TreasuryService],
    });
  });

  it('should be created', inject([TreasuryService], (service: TreasuryService) => {
    expect(service).toBeTruthy();
  }));
});
