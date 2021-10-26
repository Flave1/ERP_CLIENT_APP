import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryLiquidationDetailsComponent } from './treasury-liquidation-details.component';

describe('TreasuryLiquidationDetailsComponent', () => {
  let component: TreasuryLiquidationDetailsComponent;
  let fixture: ComponentFixture<TreasuryLiquidationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasuryLiquidationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryLiquidationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
