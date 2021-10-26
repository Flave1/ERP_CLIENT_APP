/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';

import { JournalApprovalComponent } from './Journal-approval.component';
import {ReactiveFormsModule} from '@angular/forms';
import {LoadingService} from '../../../../core/services/loading.service';
import {JournalService} from '../../../../core/services/journal.service';

describe('JournalApprovalComponent', () => {
  let component: JournalApprovalComponent;
  let fixture: ComponentFixture<JournalApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalApprovalComponent ],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: [LoadingService, JournalService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
