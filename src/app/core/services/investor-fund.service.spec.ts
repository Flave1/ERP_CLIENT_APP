import { TestBed, inject } from '@angular/core/testing';

import { InvestorFundService } from './investor-fund.service';

describe('InvestorFundService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvestorFundService]
    });
  });

  it('should be created', inject([InvestorFundService], (service: InvestorFundService) => {
    expect(service).toBeTruthy();
  }));
});
