import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOfRateFormComponent } from './change-of-rate-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('ChangeOfRateFormComponent', () => {
  let component: ChangeOfRateFormComponent;
  let fixture: ComponentFixture<ChangeOfRateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeOfRateFormComponent ],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOfRateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
