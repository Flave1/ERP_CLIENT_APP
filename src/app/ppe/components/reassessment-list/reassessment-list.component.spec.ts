import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassessmentListComponent } from './reassessment-list.component';
import {LoadingService} from '../../../core/services/loading.service';

describe('ReassessmentListComponent', () => {
  let component: ReassessmentListComponent;
  let fixture: ComponentFixture<ReassessmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReassessmentListComponent ],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReassessmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
