/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CustomerApprovalComponent } from './customer-approval.component';
import {ReactiveFormsModule} from '@angular/forms';
import {LoadingService} from '../../services/loading.service';

describe('CustomerApprovalComponent', () => {
  let component: CustomerApprovalComponent;
  let fixture: ComponentFixture<CustomerApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerApprovalComponent ],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
