import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorCustomerListComponent } from './investor-customer-list.component';
import { LoadingService } from '../../../core/services/loading.service';
import { LoanCustomerService } from '../../../core/services/loancustomer.service';
import { DepositAccountService } from '../../../core/services/depositaccount.service';
import { DepositAccountOpeningService } from '../../../core/services/depositaccountopening.service';
import { InvestorFundService } from '../../../core/services/investor-fund.service';
import { CurrencyService } from '../../../core/services/currency.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('InvestorCustomerListComponent', () => {
  let component: InvestorCustomerListComponent;
  let fixture: ComponentFixture<InvestorCustomerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvestorCustomerListComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: [
            LoadingService,
            LoanCustomerService,
            DepositAccountOpeningService,
            InvestorFundService,
            CurrencyService
          ]
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorCustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
