import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryCollectionAppraisalComponent } from './treasury-collection-appraisal.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {LoadingService} from '../../../core/services/loading.service';
import {TreasuryService} from '../../../core/services/treasury.service';
import {CreditAppraisalService} from '../../../core/services/credit-appraisal.service';

describe('TreasuryCollectionAppraisalComponent', () => {
  let component: TreasuryCollectionAppraisalComponent;
  let fixture: ComponentFixture<TreasuryCollectionAppraisalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasuryCollectionAppraisalComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: [LoadingService, TreasuryService, CreditAppraisalService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryCollectionAppraisalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
