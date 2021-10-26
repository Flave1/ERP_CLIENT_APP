import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassessmentComponent } from './reassessment.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('ReassessmentComponent', () => {
  let component: ReassessmentComponent;
  let fixture: ComponentFixture<ReassessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReassessmentComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReassessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
