import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierTellerBalancingTransactionComponent } from './cashier-teller-balancing-transaction.component';
import {LoadingService} from '../../../core/services/loading.service';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DepositAccountService} from '../../../core/services/depositaccount.service';

describe('CashierTellerBalancingTransactionComponent', () => {
  let component: CashierTellerBalancingTransactionComponent;
  let fixture: ComponentFixture<CashierTellerBalancingTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashierTellerBalancingTransactionComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        {
          provide: [LoadingService, DepositAccountService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierTellerBalancingTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
