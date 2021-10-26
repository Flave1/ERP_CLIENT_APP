import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalSetupListComponent } from './withdrawal-setup-list.component';
import {LoadingService} from '../../../core/services/loading.service';

describe('WithdrawalSetupListComponent', () => {
  let component: WithdrawalSetupListComponent;
  let fixture: ComponentFixture<WithdrawalSetupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawalSetupListComponent ],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalSetupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
