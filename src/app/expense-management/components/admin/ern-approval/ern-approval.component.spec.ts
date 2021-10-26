import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErnApprovalComponent } from './ern-approval.component';

describe('ErnApprovalComponent', () => {
  let component: ErnApprovalComponent;
  let fixture: ComponentFixture<ErnApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErnApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErnApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
