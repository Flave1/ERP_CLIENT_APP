import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerWithdrawalComponent } from './customer-withdrawal.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoadingService} from '../../../core/services/loading.service';
import {DepositAccountService} from '../../../core/services/depositaccount.service';

describe('CustomerWithdrawalComponent', () => {
  let component: CustomerWithdrawalComponent;
  let fixture: ComponentFixture<CustomerWithdrawalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerWithdrawalComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      // schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: [LoadingService, DepositAccountService]
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
