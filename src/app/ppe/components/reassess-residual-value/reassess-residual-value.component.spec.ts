import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassessResidualValueComponent } from './reassess-residual-value.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingService } from '../../../core/services/loading.service';
import { PpeService } from '../../services/ppe.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ReassessResidualValueComponent', () => {
  let component: ReassessResidualValueComponent;
  let fixture: ComponentFixture<ReassessResidualValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReassessResidualValueComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        ReactiveFormsModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: [LoadingService, PpeService]
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReassessResidualValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
