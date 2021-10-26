import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReevaluateCostComponent } from './reevaluate-cost.component';
import {RouterModule} from '@angular/router';

describe('ReevaluateCostComponent', () => {
  let component: ReevaluateCostComponent;
  let fixture: ComponentFixture<ReevaluateCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReevaluateCostComponent ],
      imports: [RouterModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReevaluateCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
