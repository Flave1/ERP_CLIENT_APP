import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTypeListComponent } from './product-type-list.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {LoadingService} from '../../../core/services/loading.service';
import {InvestorFundService} from '../../../core/services/investor-fund.service';

describe('ProductTypeListComponent', () => {
  let component: ProductTypeListComponent;
  let fixture: ComponentFixture<ProductTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductTypeListComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule],
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
    fixture = TestBed.createComponent(ProductTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
