import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalFormComponent } from './journal-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('JournalFormComponent', () => {
  let component: JournalFormComponent;
  let fixture: ComponentFixture<JournalFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalFormComponent ],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
