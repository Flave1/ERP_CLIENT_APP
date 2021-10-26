import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOfRateFormListComponent } from './change-of-rate-form-list.component';
import {LoadingService} from '../../../core/services/loading.service';

describe('ChangeOfRateFormListComponent', () => {
  let component: ChangeOfRateFormListComponent;
  let fixture: ComponentFixture<ChangeOfRateFormListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeOfRateFormListComponent ],
      providers: [
        {
          provide: LoadingService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOfRateFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
