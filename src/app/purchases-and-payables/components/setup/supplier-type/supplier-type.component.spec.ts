import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierTypeComponent } from './supplier-type.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {SubGLService} from '../../../../core/services/subgl.service';
import {SupplierService} from '../../../../core/services/supplier.service';
import {LoadingService} from '../../../../core/services/loading.service';

describe('SupplierTypeComponent', () => {
  let component: SupplierTypeComponent;
  let fixture: ComponentFixture<SupplierTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // declarations: [ SupplierTypeComponent ],
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: [SubGLService, SupplierService, LoadingService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
