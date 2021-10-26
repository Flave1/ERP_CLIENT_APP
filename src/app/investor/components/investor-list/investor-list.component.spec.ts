import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorListComponent } from './investor-list.component';
import {LoadingService} from '../../../core/services/loading.service';

describe('InvestorListComponent', () => {
  let component: InvestorListComponent;
  let fixture: ComponentFixture<InvestorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorListComponent ],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
