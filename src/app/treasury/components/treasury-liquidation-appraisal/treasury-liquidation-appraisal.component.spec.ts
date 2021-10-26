import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryLiquidationAppraisalComponent } from './treasury-liquidation-appraisal.component';

describe('TreasuryLiquidationAppraisalComponent', () => {
  let component: TreasuryLiquidationAppraisalComponent;
  let fixture: ComponentFixture<TreasuryLiquidationAppraisalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasuryLiquidationAppraisalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryLiquidationAppraisalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
