import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentApprovalCommentComponent } from './investment-approval-comment.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('InvestmentApprovalCommentComponent', () => {
  let component: InvestmentApprovalCommentComponent;
  let fixture: ComponentFixture<InvestmentApprovalCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentApprovalCommentComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentApprovalCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
