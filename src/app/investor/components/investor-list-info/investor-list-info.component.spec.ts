import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorListInfoComponent } from './investor-list-info.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoadingService} from '../../../core/services/loading.service';
import {InvestorFundService} from '../../../core/services/investor-fund.service';
import {CommonService} from '../../../core/services/common.service';
import {LoanScheduleService} from '../../../core/services/loanschedule';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('InvestorListInfoComponent', () => {
  let component: InvestorListInfoComponent;
  let fixture: ComponentFixture<InvestorListInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorListInfoComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: [LoadingService, InvestorFundService, CommonService, LoanScheduleService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorListInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
