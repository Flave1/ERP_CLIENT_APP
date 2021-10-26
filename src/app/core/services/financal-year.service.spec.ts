import { TestBed, inject } from '@angular/core/testing';

import { FinancalYearService } from './financal-year.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('FinancalYearService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinancalYearService],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([FinancalYearService], (service: FinancalYearService) => {
    expect(service).toBeTruthy();
  }));
});
