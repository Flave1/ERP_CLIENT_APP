import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingInvestmentsComponent } from './pending-investments.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('PendingInvestmentsComponent', () => {
  let component: PendingInvestmentsComponent;
  let fixture: ComponentFixture<PendingInvestmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingInvestmentsComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingInvestmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
