import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidationAppraisalComponent } from './liquidation-appraisal.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('LiquidationAppraisalComponent', () => {
  let component: LiquidationAppraisalComponent;
  let fixture: ComponentFixture<LiquidationAppraisalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiquidationAppraisalComponent ],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidationAppraisalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
