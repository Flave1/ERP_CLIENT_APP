import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErnPaymentProposalComponent } from './ern-payment-proposal.component';

describe('ErnPaymentProposalComponent', () => {
  let component: ErnPaymentProposalComponent;
  let fixture: ComponentFixture<ErnPaymentProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErnPaymentProposalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErnPaymentProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
