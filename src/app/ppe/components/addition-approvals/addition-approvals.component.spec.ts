import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionApprovalsComponent } from './addition-approvals.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoadingService} from '../../../core/services/loading.service';

describe('AdditionApprovalsComponent', () => {
  let component: AdditionApprovalsComponent;
  let fixture: ComponentFixture<AdditionApprovalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionApprovalsComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
