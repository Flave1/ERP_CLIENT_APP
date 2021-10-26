import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TillAndVaultComponent } from './till-and-vault.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {LoadingService} from '../../../core/services/loading.service';

describe('TillAndVaultComponent', () => {
  let component: TillAndVaultComponent;
  let fixture: ComponentFixture<TillAndVaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TillAndVaultComponent ],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TillAndVaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
