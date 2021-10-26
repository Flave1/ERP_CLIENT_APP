import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorReportComponent } from './investor-report.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoadingService } from '../../../../core/services/loading.service';
import { TrialBalanceService } from '../../../../core/services/trialbalance.service';
import { FinancalYearService } from '../../../../core/services/financal-year.service';
import { CompanyService } from '../../../../core/services/company.service';
import { ReportService } from '../../../../core/services/report.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InvestorReportComponent', () => {
  let component: InvestorReportComponent;
  let fixture: ComponentFixture<InvestorReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvestorReportComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: [
            LoadingService,
            TrialBalanceService,
            FinancalYearService,
            CompanyService,
            ReportService
          ]
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
