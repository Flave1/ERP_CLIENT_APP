import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApplicationsComponent } from './loan-applications.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoadingService} from '../../../core/services/loading.service';

describe('LoanApplicationsComponent', () => {
  let component: LoanApplicationsComponent;
  let fixture: ComponentFixture<LoanApplicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanApplicationsComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
