import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassessApprovalsComponent } from './reassess-approvals.component';

describe('ReassessApprovalsComponent', () => {
  let component: ReassessApprovalsComponent;
  let fixture: ComponentFixture<ReassessApprovalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReassessApprovalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReassessApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
