import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencySetupListComponent } from './currency-setup-list.component';
import {LoadingService} from '../../../core/services/loading.service';

describe('CurrencySetupListComponent', () => {
  let component: CurrencySetupListComponent;
  let fixture: ComponentFixture<CurrencySetupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencySetupListComponent ],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencySetupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
