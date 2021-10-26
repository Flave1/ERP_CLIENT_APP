import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryLiquidationCommentsComponent } from './treasury-liquidation-comments.component';

describe('TreasuryLiquidationCommentsComponent', () => {
  let component: TreasuryLiquidationCommentsComponent;
  let fixture: ComponentFixture<TreasuryLiquidationCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasuryLiquidationCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryLiquidationCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
