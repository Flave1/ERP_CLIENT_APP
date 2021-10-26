import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountReactivationAppraisalsComponent } from './account-reactivation-appraisals.component';
import {LoadingService} from '../../../core/services/loading.service';

describe('AccountReactivationAppraisalsComponent', () => {
  let component: AccountReactivationAppraisalsComponent;
  let fixture: ComponentFixture<AccountReactivationAppraisalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountReactivationAppraisalsComponent ],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountReactivationAppraisalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
