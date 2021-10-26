import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankglComponent } from './bankgl.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {LoadingService} from '../../../core/services/loading.service';
import {SubGLService} from '../../../core/services/subgl.service';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('BankglComponent', () => {
  let component: BankglComponent;
  let fixture: ComponentFixture<BankglComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankglComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: [LoadingService, SubGLService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankglComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
