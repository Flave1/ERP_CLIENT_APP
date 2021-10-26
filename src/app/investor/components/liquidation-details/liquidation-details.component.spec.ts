import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidationDetailsComponent } from './liquidation-details.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('LiquidationDetailsComponent', () => {
  let component: LiquidationDetailsComponent;
  let fixture: ComponentFixture<LiquidationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiquidationDetailsComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
