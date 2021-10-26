import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryCustomerDetailsComponent } from './treasury-customer-details.component';

describe('TreasuryCustomerDetailsComponent', () => {
  let component: TreasuryCustomerDetailsComponent;
  let fixture: ComponentFixture<TreasuryCustomerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasuryCustomerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryCustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
