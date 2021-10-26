import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOfRateComponent } from './change-of-rate.component';
import {ReactiveFormsModule} from '@angular/forms';
import {LoadingService} from '../../../core/services/loading.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('ChangeOfRateComponent', () => {
  let component: ChangeOfRateComponent;
  let fixture: ComponentFixture<ChangeOfRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeOfRateComponent ],
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOfRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
