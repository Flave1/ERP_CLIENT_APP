import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountActivationSetupListComponent } from './account-activation-setup-list.component';
import {LoadingService} from '../../../core/services/loading.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('AccountActivationSetupListComponent', () => {
  let component: AccountActivationSetupListComponent;
  let fixture: ComponentFixture<AccountActivationSetupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountActivationSetupListComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountActivationSetupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
