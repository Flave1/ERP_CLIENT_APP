import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentCustomerDetailsComponent } from './investment-customer-details.component';

describe('InvestmentCustomerDetailsComponent', () => {
  let component: InvestmentCustomerDetailsComponent;
  let fixture: ComponentFixture<InvestmentCustomerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentCustomerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentCustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
