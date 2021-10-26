import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorProductComponent } from './investor-product.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {LoadingService} from '../../../core/services/loading.service';
import {ProductService} from '../../../core/services/product.service';
import {InvestorFundService} from '../../../core/services/investor-fund.service';
import {CollateralService} from '../../../core/services/collateral.service';

describe('InvestorProductComponent', () => {
  let component: InvestorProductComponent;
  let fixture: ComponentFixture<InvestorProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorProductComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: [LoadingService, ProductService, InvestorFundService, CollateralService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
