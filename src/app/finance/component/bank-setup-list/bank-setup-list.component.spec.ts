import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankSetupListComponent } from './bank-setup-list.component';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {LoadingService} from '../../../core/services/loading.service';

describe('BankSetupListComponent', () => {
  let component: BankSetupListComponent;
  let fixture: ComponentFixture<BankSetupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankSetupListComponent ],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankSetupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
