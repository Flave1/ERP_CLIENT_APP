import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankClosureSetupListComponent } from './bank-closure-setup-list.component';
import {LoadingService} from '../../../core/services/loading.service';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('BankClosureSetupListComponent', () => {
  let component: BankClosureSetupListComponent;
  let fixture: ComponentFixture<BankClosureSetupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankClosureSetupListComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankClosureSetupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
