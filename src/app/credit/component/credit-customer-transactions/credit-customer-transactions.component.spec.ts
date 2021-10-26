import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCustomerTransactionsComponent } from './credit-customer-transactions.component';
import {LoadingService} from '../../../core/services/loading.service';
import {GLTransactionService} from '../../../core/services/gltransaction.service';
import {LoanCustomerService} from '../../../core/services/loancustomer.service';

describe('CreditCustomerTransactionsComponent', () => {
  let component: CreditCustomerTransactionsComponent;
  let fixture: ComponentFixture<CreditCustomerTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditCustomerTransactionsComponent ],
      providers: [
        {
          provide: [LoadingService, GLTransactionService, LoanCustomerService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCustomerTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
