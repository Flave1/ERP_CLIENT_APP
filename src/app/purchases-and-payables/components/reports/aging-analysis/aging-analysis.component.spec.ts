import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgingAnalysisComponent } from './aging-analysis.component';

describe('AgingAnalysisComponent', () => {
  let component: AgingAnalysisComponent;
  let fixture: ComponentFixture<AgingAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgingAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgingAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
