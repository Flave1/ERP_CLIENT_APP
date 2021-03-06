import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorDashboardComponent } from './investor-dashboard.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('InvestorDashboardComponent', () => {
  let component: InvestorDashboardComponent;
  let fixture: ComponentFixture<InvestorDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorDashboardComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
