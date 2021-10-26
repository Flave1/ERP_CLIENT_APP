import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryLiquidationComponent } from './treasury-liquidation.component';

describe('TreasuryLiquidationComponent', () => {
  let component: TreasuryLiquidationComponent;
  let fixture: ComponentFixture<TreasuryLiquidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasuryLiquidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryLiquidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
