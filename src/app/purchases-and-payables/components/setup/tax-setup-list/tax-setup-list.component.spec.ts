import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxSetupListComponent } from './tax-setup-list.component';
import {RouterTestingModule} from '@angular/router/testing';
import {LoadingService} from '../../../../core/services/loading.service';
import {SupplierService} from '../../../../core/services/supplier.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TaxSetupListComponent', () => {
  let component: TaxSetupListComponent;
  let fixture: ComponentFixture<TaxSetupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxSetupListComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        {
          provide: [LoadingService, SupplierService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxSetupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
