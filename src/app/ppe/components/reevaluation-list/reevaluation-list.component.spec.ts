import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReevaluationListComponent } from './reevaluation-list.component';

describe('ReevaluationListComponent', () => {
  let component: ReevaluationListComponent;
  let fixture: ComponentFixture<ReevaluationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReevaluationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReevaluationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
