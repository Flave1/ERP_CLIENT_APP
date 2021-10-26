import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssRequisitionComponent } from './ess-requisition.component';

describe('EssRequisitionComponent', () => {
  let component: EssRequisitionComponent;
  let fixture: ComponentFixture<EssRequisitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssRequisitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
