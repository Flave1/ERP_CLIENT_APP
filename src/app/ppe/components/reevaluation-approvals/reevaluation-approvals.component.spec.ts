import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReevaluationApprovalsComponent } from './reevaluation-approvals.component';

describe('ReevaluationApprovalsComponent', () => {
  let component: ReevaluationApprovalsComponent;
  let fixture: ComponentFixture<ReevaluationApprovalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReevaluationApprovalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReevaluationApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
