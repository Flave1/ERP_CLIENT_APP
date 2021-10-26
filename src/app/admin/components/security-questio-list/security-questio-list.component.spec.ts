import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityQuestioListComponent } from './security-questio-list.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoadingService} from '../../../core/services/loading.service';
import {CommonService} from '../../../core/services/common.service';

describe('SecurityQuestioListComponent', () => {
  let component: SecurityQuestioListComponent;
  let fixture: ComponentFixture<SecurityQuestioListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityQuestioListComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        {
          provide: [LoadingService, CommonService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityQuestioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
