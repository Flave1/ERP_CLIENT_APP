import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDepositsComponent } from './customer-deposits.component';

describe('CustomerDepositsComponent', () => {
  let component: CustomerDepositsComponent;
  let fixture: ComponentFixture<CustomerDepositsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerDepositsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDepositsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
