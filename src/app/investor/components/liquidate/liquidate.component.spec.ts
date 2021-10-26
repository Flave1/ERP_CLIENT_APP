import {
  fakeAsync,
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { LiquidateComponent } from './liquidate.component';
import { InvestorFundService } from '../../../core/services/investor-fund.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../shared/shared.module';
import { LoadingService } from '../../../core/services/loading.service';

describe('LiquidateComponent', () => {
  let component: LiquidateComponent;
  let fixture: ComponentFixture<LiquidateComponent>;

  // const investorFundServiceStub = {
  //   customers: {
  //     id: 1,
  //     name: 'John Doe'
  //   },
  //   getCustomers: async () => {
  //     component.customers = this.customers;
  //     return this.customers;
  //   }
  // };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LiquidateComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: [InvestorFundService, LoadingService]
          // useValue: investorFundServiceStub
        }
      ]
    }).compileComponents().then(() => {

    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should return list of customers', () => {
    // component.customers = this.customers;
    expect(component.customers.length).toBe(1);
  });
});
