import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalSetupComponent } from './withdrawal-setup.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {LoadingService} from '../../../core/services/loading.service';
import {DepositAccountService} from '../../../core/services/depositaccount.service';
import {CompanyService} from '../../../core/services/company.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('WithdrawalSetupComponent', () => {
  let component: WithdrawalSetupComponent;
  let fixture: ComponentFixture<WithdrawalSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawalSetupComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: [LoadingService, DepositAccountService, CompanyService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
