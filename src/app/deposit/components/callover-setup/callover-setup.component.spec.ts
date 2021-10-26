import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalloverSetupComponent } from './callover-setup.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {LoadingService} from '../../../core/services/loading.service';
import {DepositAccountService} from '../../../core/services/depositaccount.service';
import {StaffInfoService} from '../../../core/services/staff.service';
import {CompanyService} from '../../../core/services/company.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('CalloverSetupComponent', () => {
  let component: CalloverSetupComponent;
  let fixture: ComponentFixture<CalloverSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalloverSetupComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: [LoadingService, DepositAccountService, StaffInfoService, CompanyService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalloverSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
