import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryInvestmentApprovalCommentComponent } from './treasury-investment-approval-comment.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TreasuryInvestmentApprovalCommentComponent', () => {
  let component: TreasuryInvestmentApprovalCommentComponent;
  let fixture: ComponentFixture<TreasuryInvestmentApprovalCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasuryInvestmentApprovalCommentComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasuryInvestmentApprovalCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
