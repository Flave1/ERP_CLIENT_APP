import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentAppraisalComponent } from './investment-appraisal.component';

describe('InvestmentAppraisalComponent', () => {
  let component: InvestmentAppraisalComponent;
  let fixture: ComponentFixture<InvestmentAppraisalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentAppraisalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentAppraisalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
