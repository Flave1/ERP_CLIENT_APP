import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentProductTypeListComponent } from './investment-product-type-list.component';
import {LoadingService} from '../../../core/services/loading.service';

describe('InvestmentProductTypeListComponent', () => {
  let component: InvestmentProductTypeListComponent;
  let fixture: ComponentFixture<InvestmentProductTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentProductTypeListComponent ],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentProductTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
