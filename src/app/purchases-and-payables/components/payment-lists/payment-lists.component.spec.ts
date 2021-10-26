import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentListsComponent } from './payment-lists.component';

describe('PaymentListsComponent', () => {
  let component: PaymentListsComponent;
  let fixture: ComponentFixture<PaymentListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentListsComponent ],
      providers: [{}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
