import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingLiquidationComponent } from './pending-liquidation.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('PendingLiquidationComponent', () => {
  let component: PendingLiquidationComponent;
  let fixture: ComponentFixture<PendingLiquidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingLiquidationComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingLiquidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
