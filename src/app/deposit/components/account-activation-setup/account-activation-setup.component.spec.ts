import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountActivationSetupComponent } from './account-activation-setup.component';
import {ReactiveFormsModule} from '@angular/forms';

describe('AccountActivationSetupComponent', () => {
  let component: AccountActivationSetupComponent;
  let fixture: ComponentFixture<AccountActivationSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountActivationSetupComponent ],
      imports: [ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountActivationSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
