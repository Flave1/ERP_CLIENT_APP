import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountReactivationComponent } from './account-reactivation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingService } from '../../../core/services/loading.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DepositAccountOpeningService } from '../../../core/services/depositaccountopening.service';
import { DepositAccountService } from '../../../core/services/depositaccount.service';
import { CurrencyService } from '../../../core/services/currency.service';
import { CustomerAccountService } from '../../../core/services/customeraccount.service';

describe('AccountReactivationComponent', () => {
  let component: AccountReactivationComponent;
  let fixture: ComponentFixture<AccountReactivationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountReactivationComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        {
          provide: [
            LoadingService,
            DepositAccountOpeningService,
            DepositAccountService,
            CurrencyService,
            CustomerAccountService
          ]
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountReactivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
