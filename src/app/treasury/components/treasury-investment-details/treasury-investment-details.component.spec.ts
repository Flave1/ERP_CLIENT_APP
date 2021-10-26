import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryInvestmentDetailsComponent } from './treasury-investment-details.component';

describe('TreasuryInvestmentDetailsComponent', () => {
  let component: TreasuryInvestmentDetailsComponent;
  let fixture: ComponentFixture<TreasuryInvestmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasuryInvestmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryInvestmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
