import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementCertificateListComponent } from './placement-certificate-list.component';
import {LoadingService} from '../../../core/services/loading.service';
import {LoanApplicationService} from '../../../core/services/loanapplication.service';
import {ReportService} from '../../../core/services/report.service';
import {InvestorFundService} from '../../../core/services/investor-fund.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('PlacementCertificateListComponent', () => {
  let component: PlacementCertificateListComponent;
  let fixture: ComponentFixture<PlacementCertificateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacementCertificateListComponent ],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: [LoadingService, ReportService, InvestorFundService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementCertificateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
