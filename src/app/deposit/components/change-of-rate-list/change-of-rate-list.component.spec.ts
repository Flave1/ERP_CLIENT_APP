import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOfRateListComponent } from './change-of-rate-list.component';
import {LoadingService} from '../../../core/services/loading.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {DepositAccountService} from '../../../core/services/depositaccount.service';

describe('ChangeOfRateListComponent', () => {
  let component: ChangeOfRateListComponent;
  let fixture: ComponentFixture<ChangeOfRateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeOfRateListComponent ],
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
    fixture = TestBed.createComponent(ChangeOfRateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
