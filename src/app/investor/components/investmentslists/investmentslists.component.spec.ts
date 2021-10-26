import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentslistsComponent } from './investmentslists.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoadingService} from '../../../core/services/loading.service';
import {InvestorFundService} from '../../../core/services/investor-fund.service';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('InvestmentslistsComponent', () => {
  let component: InvestmentslistsComponent;
  let fixture: ComponentFixture<InvestmentslistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentslistsComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: [LoadingService, InvestorFundService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentslistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
