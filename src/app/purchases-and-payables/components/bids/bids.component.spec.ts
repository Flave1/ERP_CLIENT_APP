import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsComponent } from './bids.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {LoadingService} from '../../../core/services/loading.service';
import {PurchaseService} from '../../../core/services/purchase.service';

describe('BidsComponent', () => {
  let component: BidsComponent;
  let fixture: ComponentFixture<BidsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidsComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: [LoadingService, PurchaseService]
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
