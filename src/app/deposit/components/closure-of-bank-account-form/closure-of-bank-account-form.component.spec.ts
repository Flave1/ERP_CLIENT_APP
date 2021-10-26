import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosureOfBankAccountFormComponent } from './closure-of-bank-account-form.component';

describe('ClosureOfBankAccountFormComponent', () => {
  let component: ClosureOfBankAccountFormComponent;
  let fixture: ComponentFixture<ClosureOfBankAccountFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosureOfBankAccountFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosureOfBankAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
