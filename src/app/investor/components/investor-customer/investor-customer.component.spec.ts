import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorCustomerComponent } from './investor-customer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { CommonService } from '../../../core/services/common.service';
import { LoanCustomerService } from '../../../core/services/loancustomer.service';
import { IdentificationService } from '../../../core/services/identification.service';
import { UserAccountService } from '../../../core/services/user.service';
import { DepositAccountOpeningService } from '../../../core/services/depositaccountopening.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('InvestorCustomerComponent', () => {
  let component: InvestorCustomerComponent;
  let fixture: ComponentFixture<InvestorCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvestorCustomerComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: [
            LoadingService,
            CommonService,
            LoanCustomerService,
            IdentificationService,
            UserAccountService,
            DepositAccountOpeningService
          ]
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
