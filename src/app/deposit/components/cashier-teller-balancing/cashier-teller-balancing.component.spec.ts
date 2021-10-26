import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierTellerBalancingComponent } from './cashier-teller-balancing.component';

describe('CashierTellerBalancingComponent', () => {
  let component: CashierTellerBalancingComponent;
  let fixture: ComponentFixture<CashierTellerBalancingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashierTellerBalancingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierTellerBalancingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
