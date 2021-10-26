import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionCorrectionListComponent } from './transaction-correction-list.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {LoadingService} from '../../../core/services/loading.service';
import {DepositAccountService} from '../../../core/services/depositaccount.service';

describe('TransactionCorrectionListComponent', () => {
  let component: TransactionCorrectionListComponent;
  let fixture: ComponentFixture<TransactionCorrectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionCorrectionListComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule],
      schemas: [
        NO_ERRORS_SCHEMA
      ],
      providers: [
        {
          provide: [LoadingService, DepositAccountService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionCorrectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
