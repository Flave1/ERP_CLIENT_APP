import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDueLoansComponent } from './payment-due-loans.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('PaymentDueLoansComponent', () => {
  let component: PaymentDueLoansComponent;
  let fixture: ComponentFixture<PaymentDueLoansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentDueLoansComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDueLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
