import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TillVaultSetupListComponent } from './till-vault-setup-list.component';
import {LoadingService} from '../../../core/services/loading.service';
import {DepositAccountService} from '../../../core/services/depositaccount.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('TillVaultSetupListComponent', () => {
  let component: TillVaultSetupListComponent;
  let fixture: ComponentFixture<TillVaultSetupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TillVaultSetupListComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: [LoadingService, DepositAccountService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TillVaultSetupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
