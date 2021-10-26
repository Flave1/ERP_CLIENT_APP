import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankClosureSetupComponent } from './bank-closure-setup.component';

describe('BankClosureSetupComponent', () => {
  let component: BankClosureSetupComponent;
  let fixture: ComponentFixture<BankClosureSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankClosureSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankClosureSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
