import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankSetupComponent } from './bank-setup.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SubGLService} from '../../../core/services/subgl.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoadingService} from '../../../core/services/loading.service';
import {CommonService} from '../../../core/services/common.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('BankSetupComponent', () => {
  let component: BankSetupComponent;
  let fixture: ComponentFixture<BankSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankSetupComponent ],
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      // schemas: [NO_ERRORS_SCHEMA],
      providers: [
        SubGLService, LoadingService, CommonService
        // {
        //   provide: [SubGLService, LoadingService, CommonService]
        // }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
