import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankglListComponent } from './bankgl-list.component';
import {LoadingService} from '../../../core/services/loading.service';
import {SubGLService} from '../../../core/services/subgl.service';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('BankglListComponent', () => {
  let component: BankglListComponent;
  let fixture: ComponentFixture<BankglListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankglListComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        {
          provide: [LoadingService, SubGLService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankglListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
