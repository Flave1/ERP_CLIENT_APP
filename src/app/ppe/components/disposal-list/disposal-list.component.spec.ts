import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisposalListComponent } from './disposal-list.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {PpeService} from '../../services/ppe.service';
import {LoadingService} from '../../../core/services/loading.service';
import {ReactiveFormsModule} from '@angular/forms';

describe('DisposalListComponent', () => {
  let component: DisposalListComponent;
  let fixture: ComponentFixture<DisposalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisposalListComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule],
      schemas: [
        NO_ERRORS_SCHEMA
      ],
      providers: [
        {
          provide: [PpeService, LoadingService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisposalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
