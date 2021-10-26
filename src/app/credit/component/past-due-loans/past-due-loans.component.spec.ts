import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastDueLoansComponent } from './past-due-loans.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoadingService} from '../../../core/services/loading.service';

describe('PastDueLoansComponent', () => {
  let component: PastDueLoansComponent;
  let fixture: ComponentFixture<PastDueLoansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastDueLoansComponent ],
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
    fixture = TestBed.createComponent(PastDueLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
