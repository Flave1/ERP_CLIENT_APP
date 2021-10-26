import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryCustomerListComponent } from './treasury-customer-list.component';

describe('TreasuryCustomerListComponent', () => {
  let component: TreasuryCustomerListComponent;
  let fixture: ComponentFixture<TreasuryCustomerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasuryCustomerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryCustomerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
