import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErnPaymentApprovalComponent } from './ern-payment-approval.component';

describe('ErnPaymentApprovalComponent', () => {
  let component: ErnPaymentApprovalComponent;
  let fixture: ComponentFixture<ErnPaymentApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErnPaymentApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErnPaymentApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
