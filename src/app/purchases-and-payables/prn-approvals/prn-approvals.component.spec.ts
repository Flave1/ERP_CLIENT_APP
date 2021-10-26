import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrnApprovalsComponent } from './prn-approvals.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('PrnApprovalsComponent', () => {
  let component: PrnApprovalsComponent;
  let fixture: ComponentFixture<PrnApprovalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrnApprovalsComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrnApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
