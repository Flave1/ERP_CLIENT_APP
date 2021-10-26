import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRateManagementComponent } from './exchange-rate-management.component';
import {FormBuilder} from '@angular/forms';

describe('ExchangeRateManagementComponent', () => {
  let component: ExchangeRateManagementComponent;
  let fixture: ComponentFixture<ExchangeRateManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeRateManagementComponent ],
      imports: [FormBuilder]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeRateManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
