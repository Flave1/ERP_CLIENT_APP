import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountReactivationListComponent } from './account-reactivation-list.component';
import {LoadingService} from '../../../core/services/loading.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {DepositAccountService} from '../../../core/services/depositaccount.service';

describe('AccountReactivationListComponent', () => {
  let component: AccountReactivationListComponent;
  let fixture: ComponentFixture<AccountReactivationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountReactivationListComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: [LoadingService, DepositAccountService]
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountReactivationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
