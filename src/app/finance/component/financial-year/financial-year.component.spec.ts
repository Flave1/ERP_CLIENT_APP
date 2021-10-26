import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialYearComponent } from './financial-year.component';
import {HttpClientModule} from '@angular/common/http';

describe('FinancialYearComponent', () => {
  let component: FinancialYearComponent;
  let fixture: ComponentFixture<FinancialYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialYearComponent ],
      imports: [HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
