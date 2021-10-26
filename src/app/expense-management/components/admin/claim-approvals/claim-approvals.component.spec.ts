import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimApprovalsComponent } from './claim-approvals.component';

describe('ClaimApprovalsComponent', () => {
  let component: ClaimApprovalsComponent;
  let fixture: ComponentFixture<ClaimApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimApprovalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
