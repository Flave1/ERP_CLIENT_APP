import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferSetupComponent } from './transfer-setup.component';
import {LoadingService} from '../../../core/services/loading.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {DepositAccountService} from '../../../core/services/depositaccount.service';
import {CompanyService} from '../../../core/services/company.service';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('TransferSetupComponent', () => {
  let component: TransferSetupComponent;
  let fixture: ComponentFixture<TransferSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferSetupComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers:[
        {
          provide: [LoadingService, DepositAccountService, CompanyService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
