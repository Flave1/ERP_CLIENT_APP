import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErnApprovalListComponent } from './ern-approval-list.component';

describe('ErnApprovalListComponent', () => {
  let component: ErnApprovalListComponent;
  let fixture: ComponentFixture<ErnApprovalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErnApprovalListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErnApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
